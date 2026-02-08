import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import logo from '/logo.png';
import { FaSun, FaMoon } from 'react-icons/fa';

function useMediaQuery(minWidth) {
    const [matches, setMatches] = useState(typeof window !== 'undefined' && window.innerWidth >= minWidth);
    useEffect(() => {
        const m = window.matchMedia(`(min-width: ${minWidth}px)`);
        setMatches(m.matches);
        const fn = (e) => setMatches(e.matches);
        m.addEventListener('change', fn);
        return () => m.removeEventListener('change', fn);
    }, [minWidth]);
    return matches;
}

export default function Navbar() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();
    const [atTop, setAtTop] = useState(true);
    const isSm = useMediaQuery(640);

    useEffect(() => {
        const handleScroll = () => setAtTop(window.scrollY < 10);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollMargin = atTop ? 0 : (isSm ? 16 : 8);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 transition-colors duration-300 ${!atTop ? 'border border-gray-200 dark:border-gray-800' : 'border-b border-gray-200 dark:border-gray-800'}`}
            animate={{
                marginLeft: scrollMargin,
                marginRight: scrollMargin,
                marginTop: atTop ? 0 : 12,
                borderRadius: atTop ? 0 : 16,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold">
                                <img src={logo} alt="logo" className="h-8 w-8" />
                            </div>
                            <span className="text-xl font-bold text-gray-700 dark:text-white">DocVault</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition-colors">Features</a>
                            <a href="#pricing" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition-colors">Pricing</a>
                            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition-colors">Docs</a>
                        </div>

                        {/* Auth + Theme */}
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0B0C15]"
                                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                            </button>
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
        </motion.nav>
    );
}
