import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/signup', asyncHandler(authController.signup));
router.post('/login', asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.get('/profile', requireAuth, asyncHandler(authController.getProfile));

export default router;
