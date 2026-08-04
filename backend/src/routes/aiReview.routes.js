import { Router } from 'express';
import { aiReviewController } from '../controllers/aiReview.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * AI Review routes — mounted at /api/v1/ai-reviews
 */
const router = Router();

router.get('/', requireAuth, aiReviewController.list);
router.get('/:id', requireAuth, aiReviewController.getById);
router.post('/', requireAuth, aiReviewController.create);
router.put('/:id', requireAuth, aiReviewController.update);
router.delete('/:id', requireAuth, aiReviewController.remove);

export default router;
