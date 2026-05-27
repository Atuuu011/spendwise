// Promote an existing user to admin role.
// Usage:  npm run promote-admin -- user@example.com

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

async function promoteAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email.');
    console.error('   Usage: npm run promote-admin -- user@example.com');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      process.exitCode = 1;
      return;
    }

    if (user.role === 'admin') {
      console.log(`ℹ️  User "${user.name}" (${email}) is already an admin. Nothing to do.`);
      return;
    }

    user.role = 'admin';
    await user.save();

    console.log(`🎉 User "${user.name}" (${email}) promoted to admin!`);
  } catch (err) {
    console.error('❌ Promotion failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

promoteAdmin();