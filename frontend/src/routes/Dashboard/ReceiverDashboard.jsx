import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilter, FaDownload, FaFileAlt } from 'react-icons/fa';
import { Link } from 'react-router';
import axios from 'axios';

export default function ReceiverDashboard() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get('/api/v1/receiver/getAllRecords');
                if (response.data.success) {
                    setRecords(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch records:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    const filteredRecords = records.filter(record =>
        record.fileName.toLowerCase().includes(filter.toLowerCase()) ||
        record._id.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold mb-2">All Records</h2>
                    <p className="text-gray-500 dark:text-gray-400">View and manage incoming document metadata.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by file name or ID..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center">
                        <FaFilter className="mr-2 text-gray-400" />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center">
                        <FaDownload className="mr-2" />
                        Export View
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="px-6 py-4">File Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Created By</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">Loading records...</td></tr>
                        ) : filteredRecords.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">No records found.</td></tr>
                        ) : (
                            filteredRecords.map((record) => (
                                <tr key={record._id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                                                <FaFileAlt />
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-900 dark:text-white">{record.fileName}</span>
                                                <span className="block text-xs text-gray-500">ID: {record._id.substring(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs font-semibold">
                                            {record.categoryTags}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center text-xs">
                                                {record.owner?.fullname?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-sm">{record.owner?.fullname || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link to={`/dashboard/records/${record._id}`} className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View Details</Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
