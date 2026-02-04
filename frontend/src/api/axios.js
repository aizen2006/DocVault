import axios from 'axios';
import store from '../store/store';
import { logout, login } from '../store/authSlice';

// Create axios instance
const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Token is handled via httpOnly cookies, no need to attach manually
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Don't retry refresh-token or logout endpoints
            if (originalRequest.url?.includes('/refresh-token') || 
                originalRequest.url?.includes('/logout') ||
                originalRequest.url?.includes('/login')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue this request to retry after refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh the token
                const response = await api.post('/users/refresh-token');
                
                if (response.data.success) {
                    // Update user in store if needed
                    const currentUser = store.getState().auth.user;
                    if (currentUser) {
                        store.dispatch(login({ 
                            user: currentUser, 
                            token: response.data.data?.accessToken || null 
                        }));
                    }
                    
                    processQueue(null);
                    return api(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError);
                // Refresh failed, logout user
                store.dispatch(logout());
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
