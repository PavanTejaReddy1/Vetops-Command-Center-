import { Router } from 'express';
import { settingController } from '../controllers/setting.controller.js';

/**
 * Settings routes — mounted at /api/v1/settings
 */
const router = Router();

router.get('/', settingController.list);
router.get('/:id', settingController.getById);
router.post('/', settingController.create);
router.put('/:id', settingController.update);
router.delete('/:id', settingController.remove);

export default router;
