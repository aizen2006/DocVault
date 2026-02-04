import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { FaHome, FaFileAlt, FaChartBar, FaCog, FaSignOutAlt, FaBell, FaUserCircle, FaUpload, FaFolderOpen } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/axios';

export default function DashboardLayout() {
    const { user } = useSelector(state => state.auth);
    const role = user?.role || 'user'; // lowercase to match backend
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            dispatch(logout());
            navigate('/login', { replace: true });
        }
    };

    // Define nav items with allowed roles (lowercase to match backend)
    const allNavItems = [
        { name: 'Overview', path: '/dashboard', icon: FaHome, roles: ['sender', 'receiver'] },
        { name: 'My Records', path: '/dashboard', icon: FaUpload, roles: ['sender'], component: 'sender' },
        { name: 'All Records', path: '/dashboard/records', icon: FaFolderOpen, roles: ['receiver'] },
        { name: 'Analytics', path: '/dashboard/analytics', icon: FaChartBar, roles: ['sender', 'receiver'] },
        { name: 'Settings', path: '/dashboard/settings', icon: FaCog, roles: ['sender', 'receiver'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(role));

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0B0C15] text-gray-900 dark:text-white transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#151725] border-r border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">DV</div>
                    <div>
                        <span className="text-lg font-bold block">DocVault</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{role} Workspace</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <FaSignOutAlt className="w-5 h-5 mr-3" />
                        Log Out
                    </button>
                    <div className="mt-4 flex items-center px-4">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            {/* Placeholder Avatar */}
                            <FaUserCircle className="w-full h-full text-gray-400" />
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.fullname || user?.username || 'User'}</p>
                            <p className="text-xs text-gray-500 capitalize">{role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="bg-white dark:bg-[#151725] border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-8">
                    <h1 className="text-xl font-bold">Overview</h1>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                            <FaBell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#151725]"></span>
                        </button>
                        {role === 'sender' && (
                            <Link 
                                to="/dashboard"
                                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center"
                            >
                                + New Record
                            </Link>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
