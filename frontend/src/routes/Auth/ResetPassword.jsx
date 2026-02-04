import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import api from '../../api/axios';

const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Za-z]/, 'Password must contain at least one letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export default function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [apiMessage, setApiMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        setApiMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setApiMessage('');

        const result = resetPasswordSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post('/users/reset-password', {
                token,
                newPassword: formData.newPassword,
            });

            if (response.data.success) {
                setApiMessage('Password reset successfully. Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password.';
            setApiMessage(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter a new password for your account.
                    </p>
                </div>

                <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            New password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border ${
                                errors.newPassword ? 'border-red-500' : 'border-gray-300'
                            } p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Min 8 chars, letters & numbers"
                        />
                        {errors.newPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border ${
                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            } p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Re-enter your new password"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {apiMessage && (
                        <p className="text-sm text-center text-gray-600">{apiMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 ${
                            isLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Resetting...' : 'Reset password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

