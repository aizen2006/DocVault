import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { FaFileAlt, FaInbox, FaSpinner } from 'react-icons/fa';
import api from '../../api/axios';

export default function BrowseRecords() {
    const [records, setRecords] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (search.trim()) params.search = search.trim();
            if (category) params.category = category;
            const response = await api.get('/sender/browse', { params });
            if (response.data?.success && response.data?.data) {
                setRecords(response.data.data.records || []);
                setPagination(response.data.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
            }
        } catch (error) {
            console.error('Failed to fetch browse records:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [page, category]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchRecords();
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-end"
            >
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Browse records</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Explore and open document records.</p>
                </div>
                <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by file name..."
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All categories</option>
                        <option value="Legal">Legal</option>
                        <option value="Medical">Medical</option>
                        <option value="Financial">Financial</option>
                        <option value="Personal">Personal</option>
                        <option value="Other">Other</option>
                    </select>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                        Search
                    </motion.button>
                </form>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden shadow-sm"
            >
                <table className="w-full text-left">
                    <thead className="bg-gray-50/80 dark:bg-gray-900/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="px-6 py-4">File Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Created By</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/80 dark:divide-gray-800/80">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    <FaSpinner className="animate-spin inline-block mr-2" />Loading records...
                                </td>
                            </tr>
                        ) : records.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <FaInbox className="w-10 h-10 opacity-50" />
                                        <span>No records found.</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            records.map((record, i) => (
                                <motion.tr
                                    key={record._id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.25, delay: i * 0.03 }}
                                    className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 shrink-0">
                                                <FaFileAlt />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="block font-medium text-gray-900 dark:text-white truncate">{record.fileName}</span>
                                                <span className="block text-xs text-gray-500 dark:text-gray-400">ID: {String(record._id).substring(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-semibold">
                                            {record.categoryTags}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center text-xs shrink-0">
                                                {record.owner?.fullname?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-sm text-gray-900 dark:text-white truncate">{record.owner?.fullname || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(record.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to={`/dashboard/records/${record._id}`}
                                            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity inline-block"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!loading && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={!pagination.hasPrevPage}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                disabled={!pagination.hasNextPage}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
