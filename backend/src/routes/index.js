import { Router } from 'express';

import veterinarianRoutes from './veterinarian.routes.js';
import appointmentRoutes from './appointment.routes.js';
import forecastRoutes from './forecast.routes.js';
import taskRoutes from './task.routes.js';
import predictionRoutes from './prediction.routes.js';
import aiReviewRoutes from './aiReview.routes.js';
import reportRoutes from './report.routes.js';
import notificationRoutes from './notification.routes.js';
import userRoutes from './user.routes.js';
import auditLogRoutes from './auditLog.routes.js';
import settingRoutes from './setting.routes.js';

/**
 * Aggregates every module router under a single /api/v1 mount point.
 * Adding a new module means: add its routes/controller/service/model
 * files, then register the router here — nothing else changes.
 */
export const apiRouter = Router();

apiRouter.use('/veterinarians', veterinarianRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/forecasts', forecastRoutes);
apiRouter.use('/tasks', taskRoutes);
apiRouter.use('/predictions', predictionRoutes);
apiRouter.use('/ai-reviews', aiReviewRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/audit-logs', auditLogRoutes);
apiRouter.use('/settings', settingRoutes);
