import { Router } from 'express';
import { viewRecord } from '../controllers/record.controllers.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Routes for record view - protected, accessible by both sender and receiver
router.route('/view-record/:recordId').get(verifyJWT, requireRole('sender', 'receiver'), viewRecord);


export default router;