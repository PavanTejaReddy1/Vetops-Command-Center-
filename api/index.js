import { createApp } from '../backend/src/app.js';
import serverless from 'serverless-http';

// Create the Express app
const app = createApp();

// Export as serverless handler for Vercel
export default serverless(app);
