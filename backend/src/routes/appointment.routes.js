import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Workflow Queue / Appointments routes — mounted at /api/v1/appointments
 */
const router = Router();

router.get('/', requireAuth, appointmentController.list);
router.get('/dashboard-stats', requireAuth, appointmentController.getDashboardStats);
router.get('/:id', requireAuth, appointmentController.getById);
router.post('/', requireAuth, appointmentController.create);
router.put('/:id', requireAuth, appointmentController.update);
router.patch('/:id/cancel', requireAuth, appointmentController.cancel);
router.delete('/:id', requireAuth, appointmentController.remove);

export default router;
