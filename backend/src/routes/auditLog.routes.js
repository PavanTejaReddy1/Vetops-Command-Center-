import { Router } from 'express';
import { auditLogController } from '../controllers/auditLog.controller.js';

/**
 * Audit Logs routes — mounted at /api/v1/audit-logs
 */
const router = Router();

router.get('/', auditLogController.list);
router.get('/:id', auditLogController.getById);
router.post('/', auditLogController.create);
router.put('/:id', auditLogController.update);
router.delete('/:id', auditLogController.remove);

export default router;
