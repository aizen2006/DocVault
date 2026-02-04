import mongoose from "mongoose";
import config from "../config/index.js";
import logger from "../utils/logger.js";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${config.db.uri}/${config.db.name}`);
        logger.info(`MongoDB connected successfully`, { 
            host: connectionInstance.connection.host,
            database: config.db.name
        });
    } catch (error) {
        logger.error("MongoDB connection failed", { error: error.message });
        process.exit(1);
    }
};

export default connectDB;
