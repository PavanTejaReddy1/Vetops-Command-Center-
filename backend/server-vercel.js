/**
 * Vercel serverless entrypoint.
 *
 * Lives inside backend/ so @vercel/node finds backend/node_modules
 * and backend/package.json automatically — no cd or prefix hacks needed.
 *
 * Vercel calls this as:  export default handler(req, res)
 * The app is initialised once (module-level) and reused across invocations.
 */
import 'dotenv/config';
import { createApp } from './src/app.js';
import { connectDatabase } from './src/config/database.js';

// Initialise DB connection once at cold-start
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
