import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';

/**
 * Notifications routes — mounted at /api/v1/notifications
 */
const router = Router();

router.get('/', notificationController.list);
router.get('/:id', notificationController.getById);
router.post('/', notificationController.create);
router.put('/:id', notificationController.update);
router.delete('/:id', notificationController.remove);

export default router;
