import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Record } from "../models/record.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getUserRecords = asyncHandler(async (req, res) => {
    try {
        const records = await Record.find({ owner: req.user._id }).sort({ createdAt: -1 });
        return res.status(200)
            .json(
                new ApiResponse(200, records, "User records fetched successfully")
            );
    } catch (err) {
        throw new ApiError(500, "Failed to fetch user records", err);
    }
});

const createRecord = asyncHandler(async (req, res) => {
    const { fileName, description, categoryTags } = req.body;
    const file = req.file?.path; // file path stored in local storage via multer
    if (!fileName || !description || !categoryTags || !file) {
        throw new ApiError(400, "All fields are required");
    }
    try {
        const uploadRecord = await uploadOnCloudinary(file);
        const record = await Record.create({
            owner: req.user._id,
            fileName,
            description,
            categoryTags,
            fileUploadUrl: uploadRecord.url || '',
        })
        const createdRecord = await Record.findById(record._id);
        if (!createdRecord) {
            throw new ApiError(500, "Failed to create record");
        }
        return res.status(201)
            .json(
                new ApiResponse(201, createdRecord, "Record created successfully")
            );
    } catch (error) {
        throw new ApiError(500, "Failed to create record", error);
    }
})

export {
    getUserRecords,
    createRecord
};