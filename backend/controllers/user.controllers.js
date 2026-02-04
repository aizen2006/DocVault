import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

// Centralized cookie options from config
const getCookieOptions = () => ({ ...config.cookies.options });


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); // validation is not required here
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Error generating tokens", error)
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // Validation handled by Zod middleware
    const { fullname, email, username, password, role } = req.body;
    
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (existingUser) {
        throw new ApiError(409, "User with provided email or username already exists")
    }
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required. Make sure the form field name is 'avatar' and you use multipart/form-data.");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }
    const user = await User.create({
        fullname: fullname,
        email: email,
        username: username.toLowerCase(),
        role: role,
        password: password,
        avatar: avatar.url || '',
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new ApiError(500, "User registration failed, please try again")
    }
    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", createdUser)
    )
});

const loginUser = asyncHandler(async (req, res) => {
    // Validation handled by Zod middleware
    const { email, username, password } = req.body;

    const user = await User.findOne({
        $or: [{ username: username }, { email: email || username }]
    });

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(400, 'Incorrect Password')
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString())
    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const cookieOptions = getCookieOptions();

    return res.status(200)
        .cookie(ACCESS_COOKIE, accessToken, cookieOptions)
        .cookie(REFRESH_COOKIE, refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: LoggedInUser,
                    accessToken,
                    refreshToken,
                },
                'User successfully logined'
            )
        )
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }, {
        new: true, validateBeforeSave: false
    });
    const cookieOptions = getCookieOptions();
    return res.status(200)
        .clearCookie(ACCESS_COOKIE, cookieOptions)
        .clearCookie(REFRESH_COOKIE, cookieOptions)
        .json(
            new ApiResponse(200, 'User logged out successfully')
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.signedCookies?.[REFRESH_COOKIE] || req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthenticated access - no refresh token")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, config.jwt.refreshTokenSecret);

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

        const cookieOptions = getCookieOptions();

        return res.status(200)
            .cookie(ACCESS_COOKIE, accessToken, cookieOptions)
            .cookie(REFRESH_COOKIE, refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed successfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id)
    const passwordValdation = await user.isPasswordCorrect(oldPassword);
    if (!passwordValdation) {
        throw new ApiError(400, "old password is incorrect")
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200)
        .json(
            new ApiResponse(200, {}, "Password changed successfully")
        )
})
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    );
})
const updateAccountDetails = asyncHandler(async (req, res) => {
    // Validation handled by Zod middleware
    const { fullname, email } = req.body;

    const newUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { fullname, email } },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, newUser, "User details updated successfully")
    )
})
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    // Upload new avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar?.url) {
        throw new ApiError(500, "Error uploading avatar image");
    }
    // Get old avatar URL
    const user = await User.findById(req.user._id).select("avatar");
    // Update DB first
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: avatar.url } },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");
    // Delete old avatar (non-blocking, errors are silently ignored)
    if (user?.avatar) {
        deleteFromCloudinary(user.avatar).catch(() => {});
    }
    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User avatar updated successfully")
    );
});



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
};