import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';

export default function AuthLayout() {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    // If still loading, don't redirect yet (App.jsx handles the loading screen)
    if (isLoading) {
        return null;
    }

    // If not authenticated, redirect to login with the intended destination
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
