import mongoose from 'mongoose';

/**
 * MongoDB connection setup using Mongoose.
 * Handles connection, error logging, and graceful shutdown.
 */

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      isConnected = true;
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    throw error;
  }
}

export async function disconnectDatabase() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected gracefully');
  }
}

export function getDatabaseStatus() {
  return {
    connected: isConnected,
    state: mongoose.connection.readyState,
    name: mongoose.connection.name,
    host: mongoose.connection.host
  };
}

export function isDatabaseConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
