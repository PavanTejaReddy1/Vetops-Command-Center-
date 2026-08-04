import { Router } from 'express';
import { forecastController } from '../controllers/forecast.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Forecast & Capacity routes — mounted at /api/v1/forecasts
 */
const router = Router();

router.get('/summary', requireAuth, forecastController.getForecastSummary);
router.get('/appointment-trends', requireAuth, forecastController.getAppointmentTrends);
router.get('/veterinarian-workload', requireAuth, forecastController.getVeterinarianWorkload);
router.get('/prediction-trends', requireAuth, forecastController.getPredictionTrends);
router.get('/risk-distribution', requireAuth, forecastController.getRiskDistribution);
router.get('/task-trends', requireAuth, forecastController.getTaskTrends);
router.get('/performance-metrics', requireAuth, forecastController.getPerformanceMetrics);

export default router;
