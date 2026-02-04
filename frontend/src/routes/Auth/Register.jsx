import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaUserPlus, FaEye, FaEyeSlash, FaFileUpload, FaUser, FaEnvelope, FaLock, FaIdBadge } from 'react-icons/fa';
import { z } from 'zod';
import api from '../../api/axios';

// Define Zod schema for validation - matches backend
const registerSchema = z.object({
    fullname: z.string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must be at most 100 characters"),
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    role: z.enum(["sender", "receiver"], { errorMap: () => ({ message: "Please select a valid role" }) }),
    avatar: z.instanceof(File, { message: "Avatar image is required" }).optional()
});

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        role: '',
        avatar: null
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, avatar: e.target.files[0] }));
            if (errors.avatar) setErrors(prev => ({ ...prev, avatar: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setApiError('');

        // Manual validation check for file/empty object edge case
        let validationErrors = {};
        if (!formData.avatar || (typeof formData.avatar === 'object' && !formData.avatar.name)) {
            validationErrors.avatar = "Avatar image is required";
        }

        const result = registerSchema.safeParse(formData);
        if (!result.success) {
            result.error.issues.forEach(issue => {
                validationErrors[issue.path[0]] = issue.message;
            });
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        try {
            const payload = new FormData();
            payload.append('fullname', formData.fullname);
            payload.append('username', formData.username.toLowerCase());
            payload.append('email', formData.email.toLowerCase());
            payload.append('password', formData.password);
            payload.append('role', formData.role);
            payload.append('avatar', formData.avatar);

            const response = await api.post('/users/register', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                navigate('/login', { 
                    state: { message: 'Registration successful! Please log in.' }
                });
            }
        } catch (error) {
            const message = error.response?.data?.message || 
                           error.response?.data?.errors?.[0]?.message ||
                           "Registration failed. Please try again.";
            setApiError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 font-sans">
            <div className="w-full max-w-2xl space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                        <FaUserPlus className="h-6 w-6" />
                    </div>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Join DocVault and manage your documents securely.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FaIdBadge />
                                </span>
                                <input
                                    name="fullname"
                                    type="text"
                                    required
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className={`block w-full rounded-lg border ${errors.fullname ? 'border-red-500' : 'border-gray-300'} pl-10 p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.fullname && <p className="mt-1 text-xs text-red-500">{errors.fullname}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FaUser />
                                </span>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`block w-full rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-300'} pl-10 p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    placeholder="johndoe123"
                                />
                            </div>
                            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FaEnvelope />
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} pl-10 p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Role selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={`block w-full rounded-lg border ${errors.role ? 'border-red-500' : 'border-gray-300'} p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            >
                                <option value="">Select Role...</option>
                                <option value="sender">Sender (Uploads Docs)</option>
                                <option value="receiver">Receiver (Views Docs)</option>
                            </select>
                            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
                        </div>

                        {/* Avatar Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Avatar</label>
                            <div className={`relative flex items-center justify-center w-full border-2 border-dashed ${errors.avatar ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 hover:bg-gray-50 transition-colors`}>
                                <input
                                    type="file"
                                    name="avatar"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">
                                    <FaFileUpload className="mx-auto h-6 w-6 text-gray-400" />
                                    <span className="mt-1 block text-xs text-gray-500 truncate max-w-[150px]">
                                        {formData.avatar ? formData.avatar.name : "Upload Avatar"}
                                    </span>
                                </div>
                            </div>
                            {errors.avatar && <p className="mt-1 text-xs text-red-500">{errors.avatar}</p>}
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FaLock />
                                </span>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`block w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} pl-10 pr-10 p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    placeholder="Min 8 chars, letters & numbers"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>
                    </div>

                    <div>
                        {apiError && <p className="mb-4 text-sm text-center text-red-500 font-medium">{apiError}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}