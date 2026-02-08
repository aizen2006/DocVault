import React from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BentoGrid from '../components/landing/BentoGrid';
import BentoCard from '../components/landing/BentoCard';
import { FaBolt, FaLock, FaCode, FaRobot, FaDatabase, FaShieldAlt } from 'react-icons/fa';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0C15] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main>
                <Hero />

                {/* Features Section - Bento */}
                <section id="features" className="py-24 bg-gray-50 dark:bg-[#0F111A]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Built for speed and scale.</h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Everything you need to manage complex document lifecycles without the overhead.
                            </p>
                        </motion.div>

                        <BentoGrid>
                            {/* Row 1–2: Lightning Fast (large) */}
                            <BentoCard colSpan={3} rowSpan={2} colStart={1} rowStart={1}>
                                <div className="h-full flex flex-col">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                        <FaBolt className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Lightning Fast Search</h3>
                                    <p className="text-gray-600 dark:text-gray-400 flex-1">
                                        Our indexed query engine retrieves metadata across millions of documents in milliseconds. No more waiting.
                                    </p>
                                </div>
                            </BentoCard>
                            {/* Row 1: Automated Metadata */}
                            <BentoCard colSpan={3} rowSpan={1} colStart={4} rowStart={1}>
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                                    <FaRobot className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Automated Metadata</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    AI-driven tagging automatically classifies your documents as they enter the vault.
                                </p>
                            </BentoCard>
                            {/* Row 2: Role-based, API First */}
                            <BentoCard colSpan={2} rowSpan={1} colStart={4} rowStart={2}>
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                                    <FaLock className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Role-based Access</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Granular permissions for every sender and receiver.
                                </p>
                            </BentoCard>
                            <BentoCard colSpan={1} rowSpan={1} colStart={6} rowStart={2}>
                                <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4">
                                    <FaCode className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">API First</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    REST and GraphQL APIs.
                                </p>
                            </BentoCard>
                            {/* Row 3: Data Integrity, Enterprise Security */}
                            <BentoCard colSpan={3} rowSpan={1} colStart={1} rowStart={3}>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                        <FaDatabase className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Data Integrity</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Ensure your metadata is always accurate and synced across all your systems.
                                        </p>
                                    </div>
                                </div>
                            </BentoCard>
                            <BentoCard colSpan={3} rowSpan={1} colStart={4} rowStart={3}>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                                        <FaShieldAlt className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Enterprise Security</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Bank-grade encryption and compliance standards out of the box.
                                        </p>
                                    </div>
                                </div>
                            </BentoCard>
                        </BentoGrid>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="pricing" className="py-24 bg-white dark:bg-[#0B0C15]">
                    <motion.div
                        className="max-w-4xl mx-auto px-4 text-center"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Ready to secure your data?</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
                            Join thousands of modern teams using DocVault to manage their document infrastructure.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="/register" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all">
                                Get Started for Free
                            </a>
                            <a href="#" className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-700 text-lg font-medium rounded-full text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                Contact Sales
                            </a>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-[#08090F] border-t border-gray-200/60 dark:border-gray-800/60 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">DV</div>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">DocVault</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                The infrastructure for document metadata integrity. Built for modern development teams.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Integrations</a></li>
                                <li><a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Changelog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Resources</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">API Reference</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200/60 dark:border-gray-800/60 text-sm text-gray-500 dark:text-gray-500">
                        <p>&copy; 2026 DocVault Inc. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
