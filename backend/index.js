import config from "./config/index.js";
import connectDB from "./db/index.js";
import { app } from './app.js';
import logger from "./utils/logger.js";

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start HTTP server
        const server = app.listen(config.port, () => {
            logger.info(`Server started`, {
                port: config.port,
                env: config.env,
                nodeVersion: process.version
            });
        });

        // Handle server errors
        server.on("error", (err) => {
            logger.error("Server error", { error: err.message });
            process.exit(1);
        });

        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            logger.info(`${signal} received, shutting down gracefully`);
            server.close(() => {
                logger.info("Server closed");
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        logger.error("Failed to start server", { error: error.message });
        process.exit(1);
    }
};

startServer();

