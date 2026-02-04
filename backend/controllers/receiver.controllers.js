import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Record } from "../models/record.models.js";

const getAllRecords = asyncHandler(async (req, res) => {
    // Pagination parameters with defaults
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Optional filters
    const query = {};
    if (req.query.category) {
        query.categoryTags = req.query.category;
    }
    if (req.query.search) {
        query.fileName = { $regex: req.query.search, $options: 'i' };
    }

    // Execute queries in parallel for better performance
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
        }, "All records fetched successfully")
    );
});

export {
    getAllRecords
};