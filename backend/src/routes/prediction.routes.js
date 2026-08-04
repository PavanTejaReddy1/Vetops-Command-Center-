import { Router } from 'express';
import { predictionController } from '../controllers/prediction.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Predictions routes — mounted at /api/v1/predictions
 */
const router = Router();

router.get('/', requireAuth, predictionController.list);
router.get('/:id', requireAuth, predictionController.getById);
router.post('/', requireAuth, predictionController.create);
router.put('/:id', requireAuth, predictionController.update);
router.delete('/:id', requireAuth, predictionController.remove);

export default router;
