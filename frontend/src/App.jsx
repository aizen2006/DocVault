import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import api from './api/axios';
import { login, authCheckComplete } from './store/authSlice';
import Login from './routes/Auth/login';
import Register from './routes/Auth/Register';
import LandingPage from './routes/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './routes/Dashboard/DashboardHome';
import SenderDashboard from './routes/Dashboard/SenderDashboard';
import ReceiverDashboard from './routes/Dashboard/ReceiverDashboard';
import DocumentDetail from './routes/Dashboard/DocumentDetail';
import AuthLayout from './components/AuthLayout';

// Loading spinner component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0C15]">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get('/users/me');
        if (response.data.success) {
          dispatch(login({ user: response.data.data, token: null }));
        } else {
          dispatch(authCheckComplete());
        }
      } catch (error) {
        // Silent fail, user remains unauthenticated
        dispatch(authCheckComplete());
      }
    };
    checkSession();
  }, [dispatch]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="records" element={<ReceiverDashboard />} />
            <Route path="records/:id" element={<DocumentDetail />} />
            <Route path="analytics" element={<div className="p-8">Analytics View (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-8">Settings View</div>} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
