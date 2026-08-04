/**
 * Catches any request that didn't match a route above it.
 * Kept generic — individual routers should 404 within their own scope
 * only when a specific resource lookup fails (Phase 2).
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'NotFound',
    message: `No route matches ${req.method} ${req.originalUrl}`,
  });
}
