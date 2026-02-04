import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    token: null,
    isLoading: true, // Start with loading true for initial auth check
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        // Called after initial auth check completes (regardless of result)
        authCheckComplete: (state) => {
            state.isLoading = false;
        }
    },
});

export const { login, logout, setUser, setLoading, authCheckComplete } = authSlice.actions;
export default authSlice.reducer;
