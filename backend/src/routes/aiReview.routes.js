import { Router } from 'express';
import { aiReviewController } from '../controllers/aiReview.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', requireAuth, asyncHandler(aiReviewController.list));
router.get('/dashboard-stats', requireAuth, asyncHandler(aiReviewController.getDashboardStats));
router.get('/:id', requireAuth, asyncHandler(aiReviewController.getById));
router.post('/', requireAuth, asyncHandler(aiReviewController.create));
router.post('/generate', requireAuth, asyncHandler(aiReviewController.generate));
router.put('/:id', requireAuth, asyncHandler(aiReviewController.update));
router.patch('/:id/approve', requireAuth, asyncHandler(aiReviewController.approve));
router.patch('/:id/reject', requireAuth, asyncHandler(aiReviewController.reject));
router.patch('/:id/dismiss', requireAuth, asyncHandler(aiReviewController.dismiss));
router.delete('/:id', requireAuth, asyncHandler(aiReviewController.remove));

export default router;
