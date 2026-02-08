import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { FaHome, FaChartBar, FaCog, FaSignOutAlt, FaBell, FaUserCircle, FaUpload, FaFolderOpen, FaGlobe } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/axios';
import { motion } from 'motion/react';

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
        { name: 'My Records', path: '/dashboard/my-records', icon: FaUpload, roles: ['sender'] },
        { name: 'Browse records', path: '/dashboard/browse', icon: FaGlobe, roles: ['sender'] },
        { name: 'All Records', path: '/dashboard/records', icon: FaFolderOpen, roles: ['receiver'] },
        { name: 'Analytics', path: '/dashboard/analytics', icon: FaChartBar, roles: ['sender', 'receiver'] },
        { name: 'Settings', path: '/dashboard/settings', icon: FaCog, roles: ['sender', 'receiver'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(role));

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-[#050614] dark:via-[#050814] dark:to-[#050612] text-gray-900 dark:text-white transition-colors duration-300">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className="w-64 bg-white/90 dark:bg-[#151725]/90 border-r border-gray-200/80 dark:border-gray-800/80 backdrop-blur-md flex flex-col shadow-sm"
            >
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-3">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="h-9 w-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                    >
                        DV
                    </motion.div>
                    <div>
                        <span className="text-lg font-semibold block tracking-tight">DocVault</span>
                        <span className="text-xs text-gray-500 uppercase tracking-[0.18em]">
                            {role} workspace
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl border border-transparent ${
                                        isActive
                                            ? 'bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-100/60 dark:border-blue-800/60 shadow-sm'
                                            : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 hover:border-gray-200/60 dark:hover:border-gray-700/60'
                                    } transition-colors`}
                                >
                                    <item.icon className="w-4 h-4 mr-3" />
                                    {item.name}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200/80 dark:border-gray-800/80">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-xl transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-800"
                    >
                        <FaSignOutAlt className="w-4 h-4 mr-2.5" />
                        Log out
                    </button>
                    <div className="mt-4 flex items-center px-3 py-2 rounded-xl bg-gray-50/80 dark:bg-gray-900/40 border border-gray-200/70 dark:border-gray-800/80">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden flex items-center justify-center">
                            <FaUserCircle className="w-7 h-7 text-gray-400" />
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium truncate">
                                {user?.fullname || user?.username || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                                {role}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col overflow-hidden"
            >
                {/* Topbar */}
                <header className="bg-white/80 dark:bg-[#151725]/90 border-b border-gray-200/80 dark:border-gray-800/80 h-16 flex items-center justify-between px-8 backdrop-blur-md">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-0.5">
                            Dashboard
                        </p>
                        <h1 className="text-lg font-semibold">
                            {role === 'sender' ? 'Sender overview' : 'Receiver overview'}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full transition-colors relative border border-transparent hover:border-gray-200/80 dark:hover:border-gray-700/80"
                        >
                            <FaBell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-[#151725]" />
                        </motion.button>
                        {role === 'sender' && (
                            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                                <Link
                                    to="/dashboard/my-records"
                                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-full hover:opacity-95 transition-opacity flex items-center shadow-sm"
                                >
                                    + New Record
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <motion.main
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 overflow-y-auto p-6 sm:p-8"
                >
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </motion.main>
            </motion.div>
        </div>
    );
}
