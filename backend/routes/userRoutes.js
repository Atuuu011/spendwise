// User API routes - admin only

import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All user routes require admin access
router.use(protect, adminOnly);

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

export default router;