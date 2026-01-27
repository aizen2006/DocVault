import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Record } from "../models/record.models.js";


const getAllRecords = asyncHandler(async (_, res) => {
    try {
        const allRecords = await Record.find()
            .populate('owner', 'fullname username avatar')
            .sort({ createdAt: -1 });

        return res.status(200)
            .json(
                new ApiResponse(200, allRecords, "All records fetched successfully")
            );
    } catch (error) {
        throw new ApiError(500, "Failed to fetch all records", error);
    }
});

export {
    getAllRecords
};