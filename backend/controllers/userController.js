// User Controller - admin-only operations on user accounts

import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
import UserActivity from '../models/UserActivity.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

// @desc    Delete a user (and their expenses + activities)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete admin accounts');
  }

  // Cascade delete: remove all related expenses and activities
  await Expense.deleteMany({ user: user._id });
  await UserActivity.deleteMany({ user: user._id });
  await user.deleteOne();

  res.json({ success: true, message: 'User and related data deleted' });
});