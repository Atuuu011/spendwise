// Activity Controller - admin view of all user activities

import asyncHandler from 'express-async-handler';
import UserActivity from '../models/UserActivity.js';

// @desc    Get all activities (admin)
// @route   GET /api/activities
// @access  Private/Admin
export const getAllActivities = asyncHandler(async (req, res) => {
  const activities = await UserActivity.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(200); // cap for performance
  res.json({ success: true, count: activities.length, activities });
});