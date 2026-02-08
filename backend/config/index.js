import 'dotenv/config';
import logger from '../utils/logger.js';

/**
 * Required environment variables that must be present
 */
const REQUIRED_ENV_VARS = [
    'MONGODB_URI',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRY',
    'REFRESH_TOKEN_EXPIRY',
    'CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'COOKIE_SECRET'
];

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required variable is missing
 */
const validateEnv = () => {
    const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        const message = `Missing required environment variables: ${missing.join(', ')}`;
        logger.error(message);
        throw new Error(message);
    }
};

// Validate on module load
validateEnv();

/**
 * Determine if we're in production
 */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Centralized configuration object
 */
const config = {
    // Environment
    env: process.env.NODE_ENV || 'development',
    isProduction,

    // Server
    port: parseInt(process.env.PORT, 10) || 8000,

    // Database
    db: {
        uri: process.env.MONGODB_URI,
        name: 'DocVault'
    },

    // JWT
    jwt: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
        refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d'
    },

    // Cloudinary
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    },

    // Cookies
    // NOTE: Because frontend (Vercel) and backend (Render) are on different domains,
    // production must use sameSite: 'none' and secure: true for cookies to be sent.
    cookies: {
        secret: process.env.COOKIE_SECRET,
        options: {
            httpOnly: true,
            signed: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
    },

    // CORS: required for cross-origin cookies. Use a function so localhost + CORS_ORIGIN both work (register/login from local or deployed frontend).
    cors: {
        origin(origin, callback) {
            const normalize = (url) => (url || '').trim().replace(/\/$/, '');
            const allowed = new Set([
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                ...(process.env.CORS_ORIGIN
                    ? process.env.CORS_ORIGIN.split(',').map(normalize).filter(Boolean)
                    : []),
            ]);
            if (!origin) return callback(null, true);
            if (allowed.has(origin) || allowed.has(normalize(origin))) return callback(null, true);
            if (isProduction && !process.env.CORS_ORIGIN) return callback(null, true);
            return callback(null, false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        optionsSuccessStatus: 204,
    },

    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: isProduction ? 100 : 1000 // More lenient in development
    },

    // File uploads
    upload: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        tempDir: './public/temp'
    }
};

export default config;
