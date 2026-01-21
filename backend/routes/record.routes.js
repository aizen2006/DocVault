import { Router } from 'express';
import { viewRecord } from '../controllers/record.controllers.js';

const router = Router();

// routes for record view
router.route('/view-record/:recordId').get(viewRecord);


export default router;