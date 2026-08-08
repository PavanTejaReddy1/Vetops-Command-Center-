import { Router } from 'express';
import { settingController } from '../controllers/setting.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Settings routes — mounted at /api/v1/settings
 * Order matters: specific paths before generic /:key
 */
const router = Router();

router.get('/', requireAuth, asyncHandler(settingController.getAll));
// PUT /category/:category must come before /:key to avoid shadowing
router.put('/category/:category', requireAuth, asyncHandler(settingController.updateCategory));
router.post('/:category/reset', requireAuth, asyncHandler(settingController.reset));
router.get('/:category', requireAuth, asyncHandler(settingController.getByCategory));
router.put('/:key', requireAuth, asyncHandler(settingController.update));

export default router;
