// Database export script — dumps each MongoDB collection to a JSON file
// Run with:  npm run export-db
// Output:    backend/database-export/*.json

import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Expense from '../models/Expense.js';
import UserActivity from '../models/UserActivity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '..', 'database-export');

// Each collection we want to export, with its Mongoose model.
const collections = [
  { name: 'users', model: User },
  { name: 'expenses', model: Expense },
  { name: 'useractivities', model: UserActivity },
];

async function exportDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    // Make sure the output folder exists.
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const { name, model } of collections) {
      console.log(`📦 Exporting ${name}...`);

      // Pull all documents as plain JS objects (no Mongoose wrapper).
      const docs = await model.find({}).lean();

      // For users, strip the password hash so it's not in the export.
      const sanitized = docs.map((doc) => {
        if (name === 'users') {
          // eslint-disable-next-line no-unused-vars
          const { password, ...rest } = doc;
          return rest;
        }
        return doc;
      });

      const filePath = path.join(OUTPUT_DIR, `${name}.json`);
      await fs.writeFile(filePath, JSON.stringify(sanitized, null, 2), 'utf8');

      console.log(`   ✅ ${sanitized.length} documents → ${filePath}`);
    }

    console.log('🎉 Export complete!');
  } catch (err) {
    console.error('❌ Export failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

exportDatabase();