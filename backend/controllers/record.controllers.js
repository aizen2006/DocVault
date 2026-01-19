import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Record } from "../models/record.models.js";

const viewRecord = asyncHandler(async (req, res) => {
    const { recordId } = req.params;
    if (!recordId) {
        throw new ApiError(400, "Record ID is required");
    }
    try {
        const record = await Record.findById(recordId);
        if (!record) {
            throw new ApiError(404, "Record not found");
        }
        return res.status(200)
            .json(
                new ApiResponse(200, record, "Record fetched successfully")
            );
    } catch (error) {
        throw new ApiError(500, "Failed to fetch record", error);
    }
});

export {
    viewRecord
};