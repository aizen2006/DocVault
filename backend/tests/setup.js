/**
 * Test setup file for Jest
 * This file runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '8001';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
process.env.ACCESS_TOKEN_SECRET = 'test-access-token-secret-key-12345';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-token-secret-key-12345';
process.env.ACCESS_TOKEN_EXPIRY = '15m';
process.env.REFRESH_TOKEN_EXPIRY = '7d';
process.env.COOKIE_SECRET = 'test-cookie-secret-key';
process.env.CLOUD_NAME = 'test-cloud';
process.env.CLOUDINARY_API_KEY = 'test-api-key';
process.env.CLOUDINARY_API_SECRET = 'test-api-secret';
process.env.CORS_ORIGIN = 'http://localhost:5173';

// Increase timeout for integration tests
jest.setTimeout(30000);
