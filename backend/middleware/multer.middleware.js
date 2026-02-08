import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed MIME types for different upload contexts
const ALLOWED_MIME_TYPES = {
    // For avatar uploads
    avatar: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ],
    // For document/file uploads
    file: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'text/plain',
        'text/csv'
    ]
};

// Ensure upload directory exists (both locally and in production environments)
const uploadDir = path.resolve("public", "temp");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Generate a secure unique filename
const generateSecureFilename = (originalname) => {
    const ext = path.extname(originalname).toLowerCase();
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${timestamp}-${uniqueId}${ext}`;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const secureFilename = generateSecureFilename(file.originalname);
        cb(null, secureFilename);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Determine context based on field name
    const context = file.fieldname === 'avatar' ? 'avatar' : 'file';
    const allowedTypes = ALLOWED_MIME_TYPES[context];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1 // Only allow single file upload
    },
    fileFilter
});