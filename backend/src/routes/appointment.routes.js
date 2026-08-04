import { Router } from 'express';
import { appointmentController } from '../controllers/appointment.controller.js';

/**
 * Workflow Queue / Appointments routes — mounted at /api/v1/appointments
 */
const router = Router();

router.get('/', appointmentController.list);
router.get('/:id', appointmentController.getById);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.remove);

export default router;
