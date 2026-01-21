import React from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

export default function Navbar() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            DV
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">DocVault</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <a href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition-colors">Pricing</a>
                        <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition-colors">Docs</a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="hidden md:inline-flex text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
