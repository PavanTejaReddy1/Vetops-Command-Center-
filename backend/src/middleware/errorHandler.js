/**
 * Centralized error handler — every controller/service should funnel
 * errors here via next(err) rather than formatting responses inline.
 * Phase 2 should extend this to distinguish validation errors (400),
 * auth errors (401/403), and not-found errors (404) by error type/class.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.expose ? err.message : 'Internal server error';

  res.status(status).json({
    error: err.name || 'Error',
    message,
  });
}
