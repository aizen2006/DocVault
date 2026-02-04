import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to check if authenticated user has one of the allowed roles.
 * Must be used AFTER verifyJWT middleware.
 * @param {...string} allowedRoles - Roles that are permitted to access the route
 * @returns {Function} Express middleware function
 */
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Ensure user is authenticated (verifyJWT should have run first)
        if (!req.user) {
            throw new ApiError(401, "Unauthorized - authentication required");
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(
                403, 
                `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
            );
        }

        next();
    };
};
