// Expense Model - represents a single expense record
// Each expense belongs to one user via the 'user' reference field

import mongoose from 'mongoose';

// Allowed categories - matches the dropdown in the frontend
const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Other'];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'Other',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Text index for faster live search by title/description
expenseSchema.index({ title: 'text', description: 'text' });

const Expense = mongoose.model('Expense', expenseSchema);
export { CATEGORIES };
export default Expense;