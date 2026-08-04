import { Router } from 'express';
import { reportController } from '../controllers/report.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Reports routes — mounted at /api/v1/reports
 */
const router = Router();

router.get('/', requireAuth, reportController.list);
router.get('/:id', requireAuth, reportController.getById);
router.post('/', requireAuth, reportController.create);
router.put('/:id', requireAuth, reportController.update);
router.delete('/:id', requireAuth, reportController.remove);

export default router;
