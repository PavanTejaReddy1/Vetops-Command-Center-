import { Router } from 'express';
import { forecastController } from '../controllers/forecast.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Forecast & Capacity routes — mounted at /api/v1/forecasts
 */
const router = Router();

router.get('/', requireAuth, forecastController.list);
router.get('/:id', requireAuth, forecastController.getById);
router.post('/', requireAuth, forecastController.create);
router.put('/:id', requireAuth, forecastController.update);
router.delete('/:id', requireAuth, forecastController.remove);

export default router;
