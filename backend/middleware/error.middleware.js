import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

/**
 * 404 Not Found handler - catches requests to undefined routes
 */
export const notFoundHandler = (req, res, next) => {
    const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
    next(error);
};

/**
 * Global error handler middleware
 * Must be registered after all routes
 */
export const errorHandler = (err, req, res, next) => {
    // Default to 500 if no status code set
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = "Validation Error";
        errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for field: ${field}`;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = "Invalid token";
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = "Token expired";
    }

    // Log error
    if (statusCode >= 500) {
        logger.error(message, {
            stack: err.stack,
            path: req.path,
            method: req.method
        });
    } else {
        logger.warn(message, {
            path: req.path,
            method: req.method,
            statusCode
        });
    }

    // Send response
    const response = {
        success: false,
        statusCode,
        message,
        ...(errors.length > 0 && { errors }),
        // Include stack trace in development only
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    };

    res.status(statusCode).json(response);
};

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.http(req, res, duration);
    });

    next();
};
