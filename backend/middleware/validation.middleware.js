import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware factory that validates request body against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                const errors = result.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                throw new ApiError(400, "Validation failed", errors);
            }
            // Replace body with parsed/transformed data
            req.body = result.data;
            next();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(400, "Invalid request data");
        }
    };
};

// ============ Auth Schemas ============

export const registerSchema = z.object({
    fullname: z.string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must be at most 100 characters")
        .trim(),
    email: z.string()
        .email("Invalid email address")
        .toLowerCase()
        .trim(),
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must be at most 128 characters")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    role: z.enum(['sender', 'receiver'], {
        errorMap: () => ({ message: "Role must be either 'sender' or 'receiver'" })
    })
});

export const loginSchema = z.object({
    email: z.string().optional(),
    username: z.string().optional(),
    password: z.string().min(1, "Password is required")
}).refine(
    data => data.email || data.username,
    { message: "Either email or username is required", path: ["email"] }
);

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string()
        .min(8, "New password must be at least 8 characters")
        .max(128, "New password must be at most 128 characters")
        .regex(/[A-Za-z]/, "New password must contain at least one letter")
        .regex(/[0-9]/, "New password must contain at least one number")
}).refine(
    data => data.oldPassword !== data.newPassword,
    { message: "New password must be different from old password", path: ["newPassword"] }
);

// ============ Profile Schemas ============

export const updateDetailsSchema = z.object({
    fullname: z.string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must be at most 100 characters")
        .trim(),
    email: z.string()
        .email("Invalid email address")
        .toLowerCase()
        .trim()
});

// ============ Record Schemas ============

export const createRecordSchema = z.object({
    fileName: z.string()
        .min(1, "File name is required")
        .max(255, "File name must be at most 255 characters")
        .trim(),
    description: z.string()
        .max(1000, "Description must be at most 1000 characters")
        .optional()
        .default(""),
    categoryTags: z.enum(
        ["Document", "Images", "Audio", "PDF", "Spreadsheet", "PPT"],
        { errorMap: () => ({ message: "Invalid category. Must be one of: Document, Images, Audio, PDF, Spreadsheet, PPT" }) }
    )
});
