import {Router} from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route('/register').post(
    upload.single('avatar'),
    registerUser,
)
router.route('/login').post(loginUser)

// Protected routes
router.use(verifyJWT);