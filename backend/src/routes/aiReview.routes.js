import { Router } from 'express';
import { aiReviewController } from '../controllers/aiReview.controller.js';

/**
 * AI Review routes — mounted at /api/v1/ai-reviews
 */
const router = Router();

router.get('/', aiReviewController.list);
router.get('/:id', aiReviewController.getById);
router.post('/', aiReviewController.create);
router.put('/:id', aiReviewController.update);
router.delete('/:id', aiReviewController.remove);

export default router;
