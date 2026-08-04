import { Router } from 'express';
import { reportController } from '../controllers/report.controller.js';

/**
 * Reports routes — mounted at /api/v1/reports
 */
const router = Router();

router.get('/', reportController.list);
router.get('/:id', reportController.getById);
router.post('/', reportController.create);
router.put('/:id', reportController.update);
router.delete('/:id', reportController.remove);

export default router;
