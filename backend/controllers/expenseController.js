// Expense Controller - full CRUD + live search + dashboard stats

import asyncHandler from 'express-async-handler';
import Expense from '../models/Expense.js';
import { logActivity } from '../middleware/activityLogger.js';

// @desc    Get all expenses for logged-in user (with optional search/category filter)
// @route   GET /api/expenses?search=keyword&category=Food
// @access  Private
export const getExpenses = asyncHandler(async (req, res) => {
  const { search = '', category = '' } = req.query;

  const query = { user: req.user._id };

  // Live search: case-insensitive partial match on title OR description
  if (search.trim()) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = category;
  }

  const expenses = await Expense.find(query).sort({ date: -1 });
  res.json({ success: true, count: expenses.length, expenses });
});

// @desc    Get one expense by ID
// @route   GET /api/expenses/:id
// @access  Private
export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  // Make sure the expense belongs to the requester
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this expense');
  }
  res.json({ success: true, expense });
});

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  if (!title || amount === undefined) {
    res.status(400);
    throw new Error('Title and amount are required');
  }

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    category,
    description,
    date: date || Date.now(),
  });

  logActivity(req.user._id, 'CREATE_EXPENSE', `Created "${title}" ($${amount})`, req.ip);
  res.status(201).json({ success: true, expense });
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this expense');
  }

  const { title, amount, category, description, date } = req.body;
  expense.title = title ?? expense.title;
  expense.amount = amount ?? expense.amount;
  expense.category = category ?? expense.category;
  expense.description = description ?? expense.description;
  expense.date = date ?? expense.date;

  const updated = await expense.save();
  logActivity(req.user._id, 'UPDATE_EXPENSE', `Updated "${updated.title}"`, req.ip);
  res.json({ success: true, expense: updated });
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this expense');
  }

  await expense.deleteOne();
  logActivity(req.user._id, 'DELETE_EXPENSE', `Deleted "${expense.title}"`, req.ip);
  res.json({ success: true, message: 'Expense deleted' });
});

// @desc    Get aggregated stats for the dashboard
// @route   GET /api/expenses/stats/summary
// @access  Private
export const getExpenseStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalAgg, monthAgg, byCategory] = await Promise.all([
    Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Expense.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]),
  ]);

  res.json({
    success: true,
    stats: {
      total: totalAgg[0]?.total || 0,
      count: totalAgg[0]?.count || 0,
      thisMonth: monthAgg[0]?.total || 0,
      byCategory,
    },
  });
});