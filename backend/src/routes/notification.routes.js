import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Notifications routes — mounted at /api/v1/notifications
 */
const router = Router();

router.get('/', requireAuth, notificationController.list);
router.get('/:id', requireAuth, notificationController.getById);
router.post('/', requireAuth, notificationController.create);
router.put('/:id', requireAuth, notificationController.update);
router.delete('/:id', requireAuth, notificationController.remove);

export default router;
