import { Router } from 'express';
import { settingController } from '../controllers/setting.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Settings routes — mounted at /api/v1/settings
 */
const router = Router();

router.get('/', requireAuth, settingController.list);
router.get('/:id', requireAuth, settingController.getById);
router.post('/', requireAuth, settingController.create);
router.put('/:id', requireAuth, settingController.update);
router.delete('/:id', requireAuth, settingController.remove);

export default router;
