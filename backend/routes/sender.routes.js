import { Router } from "express";
import { createRecord, getUserRecords, getBrowseRecords } from "../controllers/sender.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate, createRecordSchema } from "../middleware/validation.middleware.js";

const router = Router();

// Apply auth and role middleware to all routes
router.use(verifyJWT);
router.use(requireRole('sender'));

// Routes for sender dashboard
router.route('/create-record').post(upload.single("file"), validate(createRecordSchema), createRecord);
router.route('/records').get(getUserRecords);
router.route('/browse').get(getBrowseRecords);

export default router;