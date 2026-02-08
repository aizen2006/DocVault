import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { FaFileAlt, FaInbox, FaPlus, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import api from '../../api/axios';

export default function SenderOverview() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await api.get('/sender/records');
                if (response.data?.success && response.data?.data?.records) {
                    setRecords(response.data.data.records);
                }
            } catch (error) {
                console.error('Failed to fetch records:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthCount = records.filter(r => new Date(r.createdAt) >= startOfMonth).length;
    const recentRecords = records.slice(0, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                    <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading overview...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total records</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{records.length}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <FaChartBar className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">This month</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{thisMonthCount}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <FaCalendarAlt className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm sm:col-span-2 lg:col-span-1"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quick action</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create a new record</p>
                        </div>
                        <Link
                            to="/dashboard/my-records"
                            className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                        >
                            <FaPlus className="w-4 h-4 mr-2" />
                            New record
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Recent records */}
            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden shadow-sm"
            >
                <div className="p-6 border-b border-gray-200/80 dark:border-gray-800/80 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Recent records</h2>
                    {records.length > 0 && (
                        <Link
                            to="/dashboard/my-records"
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                            View all
                        </Link>
                    )}
                </div>

                {records.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800/80 text-gray-400 dark:text-gray-500 mb-4">
                            <FaInbox className="w-7 h-7" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">No records yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Create your first record to get started.</p>
                        <Link
                            to="/dashboard/my-records"
                            className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors"
                        >
                            <FaPlus className="w-4 h-4 mr-2" />
                            Create your first record
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200/80 dark:divide-gray-800/80">
                        {recentRecords.map((record, i) => (
                            <motion.div
                                key={record._id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: 0.2 + i * 0.03 }}
                            >
                                <Link
                                    to={`/dashboard/records/${record._id}`}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-center min-w-0">
                                        <FaFileAlt className="text-gray-400 dark:text-gray-500 w-5 h-5 mr-3 shrink-0" />
                                        <span className="font-medium text-gray-900 dark:text-white truncate">{record.fileName}</span>
                                        <span className="ml-3 px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold shrink-0">
                                            {record.categoryTags}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
                                        {new Date(record.createdAt).toLocaleDateString()}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.section>
        </div>
    );
}
