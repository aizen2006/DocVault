import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Record } from "../models/record.models.js";


const getAllRecords = asyncHandler(async (_, res) => {
    try {
        const allRecords = await Record.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails",
                    pipeline: [
                        {
                            $project: {
                                fullname: 1,
                                username: 1,
                                avatar: 1
                            }
                        }
                    ]
                },
                $addFields: {
                    owner: {
                        $first: "$ownerDetails"
                    }
                }
            }
        ])
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