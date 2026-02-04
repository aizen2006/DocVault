import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import api from '../../api/axios';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [apiMessage, setApiMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiMessage('');
        setIsLoading(true);

        const result = forgotPasswordSchema.safeParse({ email });
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
            const response = await api.post('/users/forgot-password', { email });
            if (response.data.success) {
                setApiMessage('If an account exists for that email, a reset link has been sent.');
            }
        } catch (error) {
            const message =
                error.response?.data?.message || 'Failed to request password reset. Please try again.';
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
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your email and we&apos;ll send you instructions to reset your password.
                    </p>
                </div>

                <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`block w-full rounded-lg border ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            } p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
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
                        {isLoading ? 'Sending...' : 'Send reset link'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full text-sm text-center text-gray-500 hover:text-blue-600"
                    >
                        Back to login
                    </button>
                </form>
            </div>
        </div>
    );
}

