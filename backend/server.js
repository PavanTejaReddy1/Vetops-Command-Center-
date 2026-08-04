import 'dotenv/config';
import { createApp } from './src/app.js';
import { connectDatabase, disconnectDatabase } from './src/config/database.js';
import { validateDatabaseEnv, validateAuthEnv } from './src/utils/validateEnv.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    validateDatabaseEnv();
    validateAuthEnv();
    await connectDatabase();

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log(`VetOps API listening on port ${PORT}`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('HTTP server closed');
        await disconnectDatabase();
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
