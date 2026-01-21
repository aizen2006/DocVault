import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

export default function Hero() {
    return (
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide uppercase mb-8 border border-blue-100 dark:border-blue-800"
                >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    New: V2.0 Integration API is live
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"
                >
                    Metadata management <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                        for modern teams.
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
                >
                    Securely manage, track, and automate document metadata between Senders and Receivers. The infrastructure for data integrity.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-gray-900 bg-white hover:bg-gray-50 dark:bg-white dark:text-gray-900 shadow-md transition-all hover:scale-105">
                        Start Vaulting
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </Link>
                    <a href="#" className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-700 text-lg font-medium rounded-full text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        Read Documentation
                    </a>
                </motion.div>

                {/* Dashboard Preview Image (Placeholder Style) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className="mt-16 relative rounded-xl bg-gray-900 p-2 sm:p-4 shadow-2xl border border-gray-800"
                >
                    {/* Fake UI Structure representing the dashboard image */}
                    <div className="rounded-lg overflow-hidden bg-gray-800 aspect-[16/9] relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                        {/* Abstract UI Elements */}
                        <div className="p-8 space-y-4">
                            <div className="flex space-x-4">
                                <div className="w-1/4 h-32 bg-gray-700/50 rounded-lg animate-pulse"></div>
                                <div className="w-3/4 h-32 bg-gray-700/50 rounded-lg animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-8 bg-gray-700/30 rounded w-full"></div>
                                <div className="h-8 bg-gray-700/30 rounded w-full"></div>
                                <div className="h-8 bg-gray-700/30 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Trusted By Section */}
                <div className="mt-20">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase mb-8">Trusted by teams at</p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos (Text for now as SVG is verbose) */}
                        <span className="text-xl font-bold text-gray-400">ACME Corp</span>
                        <span className="text-xl font-bold text-gray-400">GlobeTrotter</span>
                        <span className="text-xl font-bold text-gray-400">Volted</span>
                        <span className="text-xl font-bold text-gray-400">Stacked</span>
                        <span className="text-xl font-bold text-gray-400">CodeFlow</span>
                    </div>
                </div>

            </div>

            {/* Background Glow Effects */}
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
}
