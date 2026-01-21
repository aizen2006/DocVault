import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import { FaBolt, FaLock, FaCode, FaRobot, FaDatabase, FaShieldAlt } from 'react-icons/fa';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0C15] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main>
                <Hero />

                {/* Features Section */}
                <section id="features" className="py-24 bg-gray-50 dark:bg-[#0F111A]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for speed and scale.</h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Everything you need to manage complex document lifecycles without the overhead.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all group">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                    <FaBolt className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Lightning Fast Search</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Our indexed query engine retrieves metadata across millions of documents in milliseconds. No more waiting.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all group">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                                    <FaRobot className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Automated Metadata</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    AI-driven tagging automatically classifies your documents as they enter the vault.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all group">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                    <FaLock className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Role-based Access</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Granular permissions for every sender and receiver in your organization.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all group">
                                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                                    <FaCode className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">API First</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Integrate with your existing stack using our robust REST and GraphQL APIs.
                                </p>
                            </div>
                            {/* Feature 5 */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all group">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
                                    <FaDatabase className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Data Integrity</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Ensure your metadata is always accurate and synced across all your systems.
                                </p>
                            </div>
                            {/* Feature 6 */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all group">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 mb-6 group-hover:scale-110 transition-transform">
                                    <FaShieldAlt className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Bank-grade encryption and compliance standards out of the box.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-white dark:bg-[#0B0C15]">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-6">Ready to secure your data?</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
                            Join thousands of modern teams using DocVault to manage their document infrastructure.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="#" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all">
                                Get Started for Free
                            </a>
                            <a href="#" className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-700 text-lg font-medium rounded-full text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-[#08090F] border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
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
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Integrations</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Changelog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Resources</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Documentation</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">API Reference</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Community</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Help Center</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-500">
                        <p>&copy; 2026 DocVault Inc. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
