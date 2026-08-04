/**
 * requireAuth — PHASE 2.
 *
 * Will verify a JWT from the Authorization header and attach the decoded
 * user to req.user. Left unimplemented in Phase 1 since no auth system
 * exists yet; routes are not currently protected.
 *
 * Example (for Phase 2 reference):
 *
 * import jwt from 'jsonwebtoken';
 *
 * export function requireAuth(req, res, next) {
 *   const token = req.headers.authorization?.replace('Bearer ', '');
 *   if (!token) return res.status(401).json({ message: 'Missing token' });
 *   try {
 *     req.user = jwt.verify(token, process.env.JWT_SECRET);
 *     next();
 *   } catch {
 *     res.status(401).json({ message: 'Invalid token' });
 *   }
 * }
 */
export function requireAuth(req, res, next) {
  next(); // no-op in Phase 1
}
