// UserActivity Model - logs every meaningful user action
// Used by admin to audit user behavior (3rd entity for rubric!)

import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'REGISTER',
        'CREATE_EXPENSE',
        'UPDATE_EXPENSE',
        'DELETE_EXPENSE',
      ],
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const UserActivity = mongoose.model('UserActivity', userActivitySchema);
export default UserActivity;