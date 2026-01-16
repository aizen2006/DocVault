import { Router} from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { registerUser , loginUser ,logoutUser } from "../controllers/user.controllers.js"
const router = Router()

router.post("/register", upload.single("avatar"), registerUser);

router.route('/login').post(loginUser)

// Protected routes
router.use(verifyJWT);
router.post('./logout', logoutUser);

export default router