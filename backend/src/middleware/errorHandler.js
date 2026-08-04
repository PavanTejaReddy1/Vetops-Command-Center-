/**
 * Centralized error handler — every controller/service should funnel
 * errors here via next(err) rather than formatting responses inline.
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  if (!isOperational) {
    console.error('ERROR 💥:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational ? err.message : 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && !isOperational && { stack: err.stack }),
    },
  });
}
