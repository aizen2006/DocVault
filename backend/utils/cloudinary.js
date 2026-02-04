import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import 'dotenv/config';
import { ApiError } from './ApiError.js';
import logger from './logger.js';

// Configure cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Safely removes a local file
 * @param {string} filepath - Path to the file to remove
 */
const cleanupLocalFile = (filepath) => {
    try {
        if (filepath && fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            logger.debug("Cleaned up local file", { filepath });
        }
    } catch (error) {
        logger.warn("Failed to cleanup local file", { filepath, error: error.message });
    }
};

/**
 * Uploads a file to Cloudinary
 * @param {string} localFilePath - Path to the local file
 * @returns {Promise<object|null>} Cloudinary response or null on failure
 */
const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) {
        return null;
    }

    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
        logger.warn("Upload failed: file does not exist", { path: localFilePath });
        return null;
    }

    try {
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            // Add folder organization
            folder: "docvault"
        });
        
        logger.info("File uploaded to Cloudinary", { 
            url: response.secure_url,
            publicId: response.public_id
        });
        
        return response;

    } catch (error) {
        logger.error("Cloudinary upload failed", { 
            error: error.message,
            path: localFilePath 
        });
        return null;

    } finally {
        // Always cleanup local file after upload attempt
        cleanupLocalFile(localFilePath);
    }
};

/**
 * Extracts public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} Public ID or null if invalid
 */
const extractPublicId = (url) => {
    if (!url || !url.includes("/upload/")) {
        return null;
    }
    
    try {
        // Handle URLs with version numbers: /upload/v1234567890/folder/filename.ext
        const afterUpload = url.split("/upload/")[1];
        // Remove version if present (starts with 'v' followed by digits)
        const withoutVersion = afterUpload.replace(/^v\d+\//, '');
        // Remove file extension
        const publicId = withoutVersion.replace(/\.[^/.]+$/, "");
        return publicId;
    } catch {
        return null;
    }
};

/**
 * Deletes an asset from Cloudinary
 * @param {string} fileUrl - Cloudinary URL of the file to delete
 * @returns {Promise<object>} Cloudinary deletion result
 */
const deleteFromCloudinary = async (fileUrl) => {
    if (!fileUrl) {
        throw new ApiError(400, "File URL is required for deletion");
    }

    const publicId = extractPublicId(fileUrl);
    if (!publicId) {
        throw new ApiError(400, "Invalid Cloudinary URL format");
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result === 'ok') {
            logger.info("Asset deleted from Cloudinary", { publicId });
        } else {
            logger.warn("Asset deletion returned non-ok status", { publicId, result });
        }
        
        return result;

    } catch (error) {
        logger.error("Cloudinary deletion failed", { 
            publicId, 
            error: error.message 
        });
        throw new ApiError(500, "Failed to delete asset from Cloudinary");
    }
};

// Keep the old export name for backward compatibility (typo)
const deleteFromCloudnary = deleteFromCloudinary;

export { 
    uploadOnCloudinary, 
    deleteFromCloudinary,
    deleteFromCloudnary, // backward compatibility
    cleanupLocalFile
};