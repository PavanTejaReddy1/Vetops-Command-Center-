import { Router } from 'express';
import { predictionController } from '../controllers/prediction.controller.js';

/**
 * Predictions routes — mounted at /api/v1/predictions
 */
const router = Router();

router.get('/', predictionController.list);
router.get('/:id', predictionController.getById);
router.post('/', predictionController.create);
router.put('/:id', predictionController.update);
router.delete('/:id', predictionController.remove);

export default router;
