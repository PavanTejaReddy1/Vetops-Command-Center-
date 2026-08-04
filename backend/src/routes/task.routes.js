import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Task Assignment routes — mounted at /api/v1/tasks
 */
const router = Router();

router.get('/', requireAuth, taskController.list);
router.get('/:id', requireAuth, taskController.getById);
router.post('/', requireAuth, taskController.create);
router.put('/:id', requireAuth, taskController.update);
router.delete('/:id', requireAuth, taskController.remove);

export default router;
