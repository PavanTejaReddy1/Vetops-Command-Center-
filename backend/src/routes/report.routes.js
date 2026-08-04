import { Router } from 'express';
import { reportController } from '../controllers/report.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Reports routes — mounted at /api/v1/reports
 */
const router = Router();

router.get('/appointments', requireAuth, reportController.getAppointmentReport);
router.get('/veterinarians', requireAuth, reportController.getVeterinarianPerformanceReport);
router.get('/predictions', requireAuth, reportController.getPredictionReport);
router.get('/tasks', requireAuth, reportController.getTaskReport);
router.get('/system', requireAuth, reportController.getSystemActivityReport);
router.get('/analytics/summary', requireAuth, reportController.getAnalyticsSummary);
router.get('/export/:type/:format', requireAuth, reportController.exportReport);

export default router;
