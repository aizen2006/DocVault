import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
    validate,
    registerSchema,
    loginSchema,
    changePasswordSchema,
    updateDetailsSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "../middleware/validation.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    forgotPassword,
    resetPassword,
} from "../controllers/user.controllers.js";

const router = Router()

// Public routes
router.route('/register').post(upload.single("avatar"), validate(registerSchema), registerUser);
router.route('/login').post(validate(loginSchema), loginUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/forgot-password').post(validate(forgotPasswordSchema), forgotPassword);
router.route('/reset-password').post(validate(resetPasswordSchema), resetPassword);

// Protected routes
router.use(verifyJWT);
router.route('/logout').post(logoutUser);
router.route('/change-password').post(validate(changePasswordSchema), changeCurrentPassword);
router.route('/me').get(getCurrentUser);
router.route('/update-details').put(validate(updateDetailsSchema), updateAccountDetails);
router.route('/update-avatar').put(upload.single("avatar"), updateUserAvatar);

export default router