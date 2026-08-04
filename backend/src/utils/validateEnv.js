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
  
  const uri = process.env.MONGODB_URI;
  if (uri && (uri.includes('localhost') || uri.includes('127.0.0.1'))) {
    console.warn('⚠️  Using localhost MongoDB. This is not recommended for production.');
  }
}

export function validateAuthEnv() {
  validateEnv(['JWT_SECRET']);
  
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long for security.');
  }
  if (secret && secret === 'replace-with-a-real-secret') {
    throw new Error('JWT_SECRET must be changed from the default value.');
  }
}

export function validateAIEnv() {
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY not set. AI features will not work.');
  }
}

export function validateProductionEnv() {
  if (process.env.NODE_ENV === 'production') {
    validateEnv(['MONGODB_URI', 'JWT_SECRET', 'FRONTEND_URL']);
    
    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️  GROQ_API_KEY not set in production. AI features will not work.');
    }
  }
}
