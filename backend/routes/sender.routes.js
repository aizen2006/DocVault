import { Router } from "express";
import { createRecord, getUserRecords } from "../controllers/sender.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

//Routes for sender dashboards
router.route('/create-record').post(upload.single("file"), createRecord);
router.route('/records').get(getUserRecords);


export default router;