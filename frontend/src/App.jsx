import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login } from './store/authSlice';
import Login from './routes/Auth/login';
import Register from './routes/Auth/Register';
import LandingPage from './routes/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import SenderDashboard from './routes/Dashboard/SenderDashboard';
import ReceiverDashboard from './routes/Dashboard/ReceiverDashboard';
import DocumentDetail from './routes/Dashboard/DocumentDetail';
import AuthLayout from './components/AuthLayout';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/v1/users/me');
        if (response.data.success) {
          dispatch(login({ user: response.data.data, token: null })); // Token might be httpOnly cookie
        }
      } catch (error) {
        console.log("Session verify failed:", error);
        // Silent fail, user remains unauthenticated
      }
    };
    checkSession();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<SenderDashboard />} />
            <Route path="records" element={<ReceiverDashboard />} />
            <Route path="records/:id" element={<DocumentDetail />} />
            <Route path="analytics" element={<div className="p-8">Analytics View (Performing...)</div>} />
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
