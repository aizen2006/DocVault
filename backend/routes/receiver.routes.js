import { Router } from "express";
import { getAllRecords } from "../controllers/receiver.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

// Apply auth and role middleware to all routes
router.use(verifyJWT);
router.use(requireRole('receiver'));

// Routes for receiver dashboard
router.route('/getAllRecords').get(getAllRecords);

export default router;