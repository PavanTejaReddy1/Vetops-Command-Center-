import { createApp } from '../backend/src/app.js';

// Create the Express app
const app = createApp();

// Export as a handler function for Vercel serverless
export default function handler(req, res) {
  return app(req, res);
}
