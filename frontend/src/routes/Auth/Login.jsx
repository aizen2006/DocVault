import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';
import api from '../../api/axios';

// Define Zod schema for validation
const loginSchema = z.object({
    email: z.string().min(1, "Email or Username is required"),
    password: z.string().min(1, "Password is required"),
});

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    // Redirect if already authenticated
    const from = location.state?.from?.pathname || '/dashboard';
    if (isAuthenticated) {
        navigate(from, { replace: true });
    }

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear specific error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setApiError(''); // Clear global error
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setApiError('');

        // Validate form
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach(issue => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            setIsLoading(false);
            return;
        }

        try {
            // API Call - send as 'username' to allow backend to search both username and email
            const response = await api.post('/users/login', {
                username: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                // Dispatch login action
                dispatch(login({ 
                    user: response.data.data.user, 
                    token: response.data.data.accessToken 
                }));
                // Redirect to original destination or dashboard
                navigate(from, { replace: true });
            }
        } catch (error) {
            const message = error.response?.data?.message || "An error occurred during login. Please try again.";
            setApiError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                {/* Header Section */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                        <FaLock className="h-6 w-6" />
                    </div>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                        DocVault
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                {/* Form Section */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-5">
                        {/* Email/Username Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                                Email or Username
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="username"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email or username"
                                className={`block w-full rounded-lg border ${errors.email ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} p-3 text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:outline-none transition-all duration-200 sm:text-sm`}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`block w-full rounded-lg border ${errors.password ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} p-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:outline-none transition-all duration-200 sm:text-sm`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>
                    </div>

                    {/* Meta Options */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link
                                to="/forgot-password"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        {apiError && <p className="mb-4 text-sm text-center text-red-500 font-medium">{apiError}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
