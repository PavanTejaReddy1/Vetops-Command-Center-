import { createApp } from '../backend/src/app.js';

// Create the Express app
const app = createApp();

// Vercel serverless handler
export default function handler(req, res) {
  app(req, res);
}
