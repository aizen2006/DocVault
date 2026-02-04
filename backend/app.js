import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { notFoundHandler, errorHandler, requestLogger } from "./middleware/error.middleware.js";
import config from "./config/index.js";

const app = express();

// CORS configuration
app.use(cors(config.cors));

// Cookie parser with secret for signed cookies
app.use(cookieParser(config.cookies.secret));

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Static files
app.use(express.static('public', { maxAge: '1d' }));

// Request logging (before routes)
app.use(requestLogger);

// Rate limiting
app.use(rateLimit({
    ...config.rateLimit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." }
}));

// Health check endpoint (before auth routes, no rate limiting)
app.get('/health', async (req, res) => {
    const healthcheck = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
        version: process.env.npm_package_version || '1.0.0'
    };

    try {
        // Check MongoDB connection
        const mongoose = await import('mongoose');
        const dbState = mongoose.default.connection.readyState;
        healthcheck.database = {
            status: dbState === 1 ? 'connected' : 'disconnected',
            readyState: dbState
        };

        if (dbState !== 1) {
            healthcheck.status = 'degraded';
        }
    } catch (error) {
        healthcheck.status = 'degraded';
        healthcheck.database = { status: 'error', message: error.message };
    }

    const statusCode = healthcheck.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(healthcheck);
});

// Route imports
import userRouter from './routes/user.routes.js';
import recordRouter from './routes/record.routes.js';
import senderRouter from './routes/sender.routes.js';
import receiverRouter from './routes/receiver.routes.js';

// API v1 routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/records", recordRouter);
app.use("/api/v1/sender", senderRouter);
app.use("/api/v1/receiver", receiverRouter);

// 404 handler (after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export { app };