import { createApp } from '../backend/src/app.js';
import serverless from 'serverless-http';

// Create the Express app
const app = createApp();

// Export for Vercel serverless function using serverless-http
export default serverless(app);
