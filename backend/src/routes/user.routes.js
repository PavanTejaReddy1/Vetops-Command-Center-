import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', requireAuth, asyncHandler(userController.list));
router.get('/:id', requireAuth, asyncHandler(userController.getById));
router.post('/', requireAuth, asyncHandler(userController.create));
router.post('/invite', requireAuth, asyncHandler(userController.invite));
router.put('/:id', requireAuth, asyncHandler(userController.update));
router.patch('/:id/toggle-active', requireAuth, asyncHandler(userController.toggleActive));
router.delete('/:id', requireAuth, asyncHandler(userController.remove));

export default router;
