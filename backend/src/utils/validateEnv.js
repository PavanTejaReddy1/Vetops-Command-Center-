/**
 * Environment variable validation utility.
 * Ensures all required environment variables are set before starting the server.
 */

export function validateEnv(requiredVars = []) {
  const missing = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

export function validateDatabaseEnv() {
  validateEnv(['MONGODB_URI']);
}

export function validateAuthEnv() {
  validateEnv(['JWT_SECRET']);
}
