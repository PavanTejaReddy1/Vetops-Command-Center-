import { Router } from 'express';
import { forecastController } from '../controllers/forecast.controller.js';

/**
 * Forecast & Capacity routes — mounted at /api/v1/forecasts
 */
const router = Router();

router.get('/', forecastController.list);
router.get('/:id', forecastController.getById);
router.post('/', forecastController.create);
router.put('/:id', forecastController.update);
router.delete('/:id', forecastController.remove);

export default router;
