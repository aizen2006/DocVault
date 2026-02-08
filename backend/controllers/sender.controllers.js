import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Record } from "../models/record.models.js";
import { uploadOnCloudinary, cleanupLocalFile } from "../utils/cloudinary.js";

const getUserRecords = asyncHandler(async (req, res) => {
    // Pagination parameters with defaults
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Optional category filter
    const categoryFilter = req.query.category;
    const query = { owner: req.user._id };
    if (categoryFilter) {
        query.categoryTags = categoryFilter;
    }

    // Execute queries in parallel for better performance
    const [records, total] = await Promise.all([
        Record.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Record.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);
    
    return res.status(200).json(
        new ApiResponse(200, {
            records,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }, "User records fetched successfully")
    );
});

const getBrowseRecords = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.category) {
        query.categoryTags = req.query.category;
    }
    if (req.query.search) {
        query.fileName = { $regex: req.query.search, $options: 'i' };
    }

    const [records, total] = await Promise.all([
        Record.find(query)
            .populate('owner', 'fullname username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Record.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
        new ApiResponse(200, {
            records,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }, "Browse records fetched successfully")
    );
});

const createRecord = asyncHandler(async (req, res) => {
    // Validation handled by Zod middleware
    const { fileName, description, categoryTags } = req.body;
    const filePath = req.file?.path;
    
    // Check for file upload
    if (!filePath) {
        throw new ApiError(400, "File is required. Make sure the form field name is 'file' and you use multipart/form-data.");
    }

    // Upload to Cloudinary
    const uploadResult = await uploadOnCloudinary(filePath);
    
    if (!uploadResult || !uploadResult.secure_url) {
        // File is already cleaned up by uploadOnCloudinary
        throw new ApiError(500, "Failed to upload file to cloud storage");
    }

    // Create record in database
    const record = await Record.create({
        owner: req.user._id,
        fileName,
        description: description || "",
        categoryTags,
        fileUploadUrl: uploadResult.secure_url,
    });

    if (!record) {
        throw new ApiError(500, "Failed to create record in database");
    }

    return res.status(201).json(
        new ApiResponse(201, record, "Record created successfully")
    );
});

export {
    getUserRecords,
    getBrowseRecords,
    createRecord
};