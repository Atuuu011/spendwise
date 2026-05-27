// Helper to record a user activity in one line
// Used inside controllers after important actions

import UserActivity from '../models/UserActivity.js';

export const logActivity = async (userId, action, details = '', ip = '') => {
  try {
    await UserActivity.create({ user: userId, action, details, ipAddress: ip });
  } catch (err) {
    // Don't break the request if logging fails
    console.error('Activity log failed:', err.message);
  }
};