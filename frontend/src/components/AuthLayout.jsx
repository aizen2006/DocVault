import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

export default function AuthLayout() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    // If we are strictly checking local state, we might flash a redirect if persistence hasn't loaded 
    // But since we will add persistence check in App.jsx top level, by the time we render routes 
    // we should know the state. 
    // HOWEVER, for a smoother UX, we can just rely on the Redux state.

    // For now, simple check.

    // NOTE: In a real app with async persistence check on mount, 
    // we might want to wait for "loading" state from auth slice.

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
