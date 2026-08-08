import { Router } from 'express';
import { auditLogController } from '../controllers/auditLog.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Audit Logs routes — mounted at /api/v1/audit-logs
 * Order matters: /export/:format must come before /:id so 'export' is not
 * captured as an :id parameter.
 */
const router = Router();

router.get('/', requireAuth, asyncHandler(auditLogController.list));
router.get('/export/:format', requireAuth, asyncHandler(auditLogController.export));
router.get('/:id', requireAuth, asyncHandler(auditLogController.getById));
router.post('/', requireAuth, asyncHandler(auditLogController.create));

export default router;
