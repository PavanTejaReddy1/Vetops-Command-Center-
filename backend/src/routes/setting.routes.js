import { Router } from 'express';
import { settingController } from '../controllers/setting.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Settings routes — mounted at /api/v1/settings
 */
const router = Router();

router.get('/', requireAuth, settingController.getAll);
router.get('/:category', requireAuth, settingController.getByCategory);
router.put('/:key', requireAuth, settingController.update);
router.put('/category/:category', requireAuth, settingController.updateCategory);
router.post('/:category/reset', requireAuth, settingController.reset);

export default router;
