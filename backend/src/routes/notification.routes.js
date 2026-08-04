import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Notifications routes — mounted at /api/v1/notifications
 */
const router = Router();

router.get('/', requireAuth, notificationController.list);
router.get('/unread-count', requireAuth, notificationController.getUnreadCount);
router.get('/:id', requireAuth, notificationController.getById);
router.post('/', requireAuth, notificationController.create);
router.patch('/:id/mark-read', requireAuth, notificationController.markAsRead);
router.post('/mark-all-read', requireAuth, notificationController.markAllAsRead);
router.delete('/:id', requireAuth, notificationController.remove);

export default router;
