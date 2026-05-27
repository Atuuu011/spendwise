// Expense API routes

import express from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All expense routes require authentication
router.use(protect);

router.route('/').get(getExpenses).post(createExpense);
router.get('/stats/summary', getExpenseStats);
router
  .route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;