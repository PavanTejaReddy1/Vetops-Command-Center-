import { Router } from 'express';
import { auditLogController } from '../controllers/auditLog.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Audit Logs routes — mounted at /api/v1/audit-logs
 */
const router = Router();

router.get('/', requireAuth, auditLogController.list);
router.get('/:id', requireAuth, auditLogController.getById);
router.post('/', requireAuth, auditLogController.create);
router.get('/export/:format', requireAuth, auditLogController.export);

export default router;
