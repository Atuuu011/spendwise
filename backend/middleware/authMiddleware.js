// Auth Middleware - verifies JWT token and attaches user to req

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Token comes from header: Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (without password) to the request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User no longer exists');
      }
      return next();
    } catch (err) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  res.status(401);
  throw new Error('Not authorized, no token provided');
});