import { Router } from 'express';
import { veterinarianController } from '../controllers/veterinarian.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Veterinarians routes — mounted at /api/v1/veterinarians
 */
const router = Router();

router.get('/', requireAuth, veterinarianController.list);
router.get('/:id', requireAuth, veterinarianController.getById);
router.post('/', requireAuth, veterinarianController.create);
router.put('/:id', requireAuth, veterinarianController.update);
router.delete('/:id', requireAuth, veterinarianController.remove);

export default router;
