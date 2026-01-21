import React, { useState, useEffect } from 'react';
import { FaFileUpload, FaCheckCircle, FaClock, FaSpinner, FaFileAlt } from 'react-icons/fa';
import { z } from 'zod';
import axios from 'axios';
import { Link } from 'react-router';

// Schema for validation
const entrySchema = z.object({
    fileName: z.string().min(1, "File name is required"),
    categoryTags: z.string().refine(val => val !== "Select...", { message: "Please select a category" }),
    description: z.string().min(1, "Description is required"),
    file: z.instanceof(File, { message: "File is required" }).or(z.object({})) // Allow object for initial state check if needed, but we check truthiness
});

export default function SenderDashboard() {
    const [formData, setFormData] = useState({
        fileName: '',
        categoryTags: 'Select...',
        description: '',
        file: null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [records, setRecords] = useState([]);
    const [loadingRecords, setLoadingRecords] = useState(true);

    // Fetch Records on Mount
    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await axios.get('/api/v1/sender/records');
            if (response.data.success) {
                setRecords(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch records:", error);
        } finally {
            setLoadingRecords(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const handleSave = async () => {
        // Custom check for file as z.instanceof(File) can be tricky with libraries
        let validationErrors = {};
        if (!formData.fileName) validationErrors.fileName = "File name is required";
        if (formData.categoryTags === 'Select...') validationErrors.categoryTags = "Please select a category";
        if (!formData.description) validationErrors.description = "Description is required";
        if (!formData.file) validationErrors.file = "Please upload a file";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const payload = new FormData();
            payload.append('fileName', formData.fileName);
            payload.append('categoryTags', formData.categoryTags);
            payload.append('description', formData.description);
            payload.append('file', formData.file);

            const response = await axios.post('/api/v1/sender/create-record', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                // Reset form
                setFormData({
                    fileName: '',
                    categoryTags: 'Select...',
                    description: '',
                    file: null
                });
                alert("Record created successfully!");
                fetchRecords(); // Refresh list
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert(error.response?.data?.message || "Upload failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">

            {/* Quick Metadata Entry */}
            <section className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">New Record Entry</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">File Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Q3_Report.pdf"
                            className={`w-full bg-gray-50 dark:bg-gray-900 border ${errors.fileName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={formData.fileName}
                            onChange={e => setFormData({ ...formData, fileName: e.target.value })}
                        />
                        {errors.fileName && <p className="text-xs text-red-500 mt-1">{errors.fileName}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                        <select
                            className={`w-full bg-gray-50 dark:bg-gray-900 border ${errors.categoryTags ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={formData.categoryTags}
                            onChange={e => setFormData({ ...formData, categoryTags: e.target.value })}
                        >
                            <option>Select...</option>
                            <option>Financial</option>
                            <option>Legal</option>
                            <option>Technical</option>
                        </select>
                        {errors.categoryTags && <p className="text-xs text-red-500 mt-1">{errors.categoryTags}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">File Upload</label>
                        <div className={`relative w-full bg-gray-50 dark:bg-gray-900 border ${errors.file ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg px-4 py-3 text-sm flex items-center`}>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <FaFileUpload className="mr-2 text-gray-400" />
                            <span className="truncate text-gray-500">{formData.file ? formData.file.name : "Choose File..."}</span>
                        </div>
                        {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                        <input
                            type="text"
                            placeholder="Short description..."
                            className={`w-full bg-gray-50 dark:bg-gray-900 border ${errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center"
                    >
                        {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null}
                        {isSubmitting ? 'Uploading...' : 'Save Record'}
                    </button>
                </div>
            </section>

            {/* Recent Activity Table */}
            <section className="bg-white dark:bg-[#151725] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold">My Records</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">File Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {loadingRecords ? (
                                <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : records.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-4 text-center">No records found.</td></tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium flex items-center">
                                            <FaFileAlt className="text-gray-400 mr-3" />
                                            {record.fileName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
                                                {record.categoryTags}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-green-500 text-xs font-bold uppercase tracking-wide">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                Active
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/dashboard/records/${record._id}`} className="text-blue-600 dark:text-blue-400 hover:underline">View</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
