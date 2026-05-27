// Activity API routes - admin only

import express from 'express';
import { getAllActivities } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/', getAllActivities);

export default router;