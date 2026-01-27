import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaFilePdf, FaEdit, FaSave, FaCheck, FaTimes, FaFileAlt } from 'react-icons/fa';
import { Link, useParams } from 'react-router';
import axios from 'axios';

export default function DocumentDetail() {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const response = await axios.get(`/api/v1/records/view-record/${id}`);
                if (response.data.success) {
                    setMetadata(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch record details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRecord();
        }
    }, [id]);

    const handleSave = () => {
        setIsEditing(false);
        // Implement real update API here in future steps
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading document details...</div>;
    }

    if (!metadata) {
        return <div className="p-8 text-center text-red-500">Document not found.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb / Back */}
            <div className="flex items-center text-sm text-gray-500">
                <Link to="/dashboard/records" className="hover:text-blue-600 flex items-center">
                    <FaArrowLeft className="mr-2" />
                    Back to Records
                </Link>
                <span className="mx-2">/</span>
                <span>{metadata.categoryTags || 'Uncategorized'}</span>
                <span className="mx-2">/</span>
                <span className="text-gray-900 dark:text-gray-300 font-medium">{metadata.fileName}</span>
            </div>

            {/* Header Card */}
            <div className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 text-2xl">
                            <FaFilePdf />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                {metadata.fileName}
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded uppercase tracking-wide">Verified</span>
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">/Records/{new Date(metadata.createdAt).getFullYear()}/{metadata.fileName}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center">
                                    <FaTimes className="mr-2" /> Cancel
                                </button>
                                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                                    <FaSave className="mr-2" /> Save Changes
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white dark:bg-[#151725] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center">
                                    <FaEdit className="mr-2" /> Edit Metadata
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center shadow-lg shadow-blue-500/30">
                                    Download
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">File Size</span>
                        <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                            {metadata.fileSize || 'N/A'}
                        </span>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Format</span>
                        <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                            <FaFilePdf className="text-gray-400" />
                            {metadata.fileType || 'PDF'}
                        </span>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sensitivity</span>
                        <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                            Confidential
                        </span>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Language</span>
                        <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                            English (US)
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description Section */}
                    <div className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                            Description
                        </h3>
                        {isEditing ? (
                            <textarea
                                className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={metadata.description}
                                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                            />
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {metadata.description || 'No description provided.'}
                            </p>
                        )}
                    </div>

                    {/* Tags Section */}
                    <div className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                            Category & Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700">
                                #{metadata.categoryTags}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Ownership</h3>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                                {metadata.owner?.fullname?.charAt(0) || '?'}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{metadata.owner?.fullname || 'Unknown'}</p>
                                <p className="text-xs text-gray-500">@{metadata.owner?.username}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Timeline</h3>
                        <div className="space-y-6 border-l-2 border-gray-100 dark:border-gray-800 ml-2 pl-6">
                            <div className="relative">
                                <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#151725]"></span>
                                <p className="text-xs text-gray-500 mb-1">Last Modified</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(metadata.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="relative">
                                <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 ring-4 ring-white dark:ring-[#151725]"></span>
                                <p className="text-xs text-gray-500 mb-1">Created</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(metadata.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">System ID</h3>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                            {metadata._id}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
