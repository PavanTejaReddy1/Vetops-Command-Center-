/**
 * Vercel serverless API handler — auto-discovered from /api/index.js
 *
 * Vercel treats every file in /api as a serverless function automatically.
 * This file imports the Express app from backend/ and wraps it as a handler.
 *
 * Dependency resolution: Vercel installs from the root package.json which
 * lists backend deps, so node_modules are available at the repo root level.
 */
import { createApp } from '../backend/src/app.js';
import { connectDatabase } from '../backend/src/config/database.js';

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
