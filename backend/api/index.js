/**
 * Vercel serverless API handler — auto-discovered from /api/index.js
 *
 * Vercel treats every file in /api as a serverless function automatically.
 * This file imports the Express app from backend/ and wraps it as a handler.
 */
import 'dotenv/config';
import { createApp } from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';

// DB connection is reused across warm invocations
let dbConnected = false;
async function ensureDb() {
  if (!dbConnected) {
    await connectDatabase();
    dbConnected = true;
  }
}

const app = createApp();

export default async function handler(req, res) {
  await ensureDb();
  return app(req, res);
}
