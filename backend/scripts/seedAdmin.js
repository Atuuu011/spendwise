// Seed an admin user into the database for demo/testing purposes.
// Usage:  npm run seed-admin
//
// Creates the user if missing. If the user already exists, promotes them
// to admin (so this is safe to run repeatedly).

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Default admin credentials for the demo. Change here if needed.
const ADMIN_NAME = 'Admin User';
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'admin123';

async function seedAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      if (existing.role === 'admin') {
        console.log(`ℹ️  Admin user "${ADMIN_EMAIL}" already exists and is already admin. Nothing to do.`);
        return;
      }
      existing.role = 'admin';
      await existing.save();
      console.log(`✅ Existing user "${ADMIN_EMAIL}" promoted to admin.`);
      return;
    }

    // The User model's pre-save hook will hash the password with bcrypt.
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });

    console.log('🎉 Admin user created successfully!');
    console.log('   Email:    ', admin.email);
    console.log('   Password: ', ADMIN_PASSWORD);
    console.log('   Role:     ', admin.role);
    console.log('   ⚠️  This password is in plain text in the script for demo purposes only.');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();