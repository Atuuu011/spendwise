// SpendWise Backend - Entry Point
// Sets up Express server, middleware, routes, error handling, DB connection

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load .env variables BEFORE anything else
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS - allow frontend to call this API
// Accepts: localhost (dev), CLIENT_URL from env, and any spendwise-*.vercel.app subdomain
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      // Allow exact matches from allowedOrigins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow any *.vercel.app URL that starts with "spendwise" (covers all preview deploys)
      if (/^https:\/\/spendwise[\w-]*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Block everything else
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({
    name: 'SpendWise API',
    status: 'running',
    version: '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);

// Error handling - MUST be after all routes
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
