import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getDatabaseStatus } from './config/database.js';

/**
 * Express app factory. Kept separate from server.js so the app instance
 * can be imported directly in tests without binding a port.
 */
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    const dbStatus = getDatabaseStatus();
    res.json({
      status: 'ok',
      service: 'vetops-api',
      phase: 2,
      database: {
        connected: dbStatus.connected,
        state: dbStatus.state,
        name: dbStatus.name,
        host: dbStatus.host
      }
    });
  });

  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
