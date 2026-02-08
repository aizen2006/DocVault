import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import SenderOverview from './SenderOverview';
import ReceiverDashboard from './ReceiverDashboard';

export default function DashboardHome() {
    const { user } = useSelector(state => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role-based rendering: sender sees Overview, receiver sees All Records list
    if (user.role === 'sender' || user.role === 'Sender') {
        return <SenderOverview />;
    } else if (user.role === 'receiver' || user.role === 'Receiver') {
        return <ReceiverDashboard />;
    } else {
        // Fallback or Admin view
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-700">Welcome, {user?.fullname ?? user?.fullName ?? user?.username}</h2>
                <p className="text-gray-500 mt-2">Please select an option from the menu.</p>
            </div>
        );
    }
}
