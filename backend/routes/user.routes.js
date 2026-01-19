import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
} from "../controllers/user.controllers.js";

const router = Router()

router.route('/register').post(upload.single("avatar"), registerUser);
router.route('/login').post(loginUser)

// Protected routes
router.use(verifyJWT);
router.route('/logout').post(logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(changeCurrentPassword);
router.route('/me').get(getCurrentUser);
router.route('/update-details').put(updateAccountDetails);
router.route('/update-avatar').put(upload.single("avatar"), updateUserAvatar);

export default router