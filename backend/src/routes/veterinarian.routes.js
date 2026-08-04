import { Router } from 'express';
import { veterinarianController } from '../controllers/veterinarian.controller.js';

/**
 * Veterinarians routes — mounted at /api/v1/veterinarians
 */
const router = Router();

router.get('/', veterinarianController.list);
router.get('/:id', veterinarianController.getById);
router.post('/', veterinarianController.create);
router.put('/:id', veterinarianController.update);
router.delete('/:id', veterinarianController.remove);

export default router;
