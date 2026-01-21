import { Router } from "express";
import { getAllRecords } from "../controllers/receiver.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

// Routes for receiver dashboard
router.route('/getAllRecords').get(getAllRecords);

export default router;