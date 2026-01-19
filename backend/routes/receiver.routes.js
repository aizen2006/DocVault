import { Router } from "express";
import { getAllRecords } from "../controllers/receiver.controllers.js";

const router = Router();
// Routes for receiver dashboard
router.route('/getAllRecords').get(getAllRecords);

export default router;