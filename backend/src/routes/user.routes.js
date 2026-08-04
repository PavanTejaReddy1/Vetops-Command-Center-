import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

/**
 * Users routes — mounted at /api/v1/users
 */
const router = Router();

router.get('/', requireAuth, userController.list);
router.get('/:id', requireAuth, userController.getById);
router.post('/', requireAuth, userController.create);
router.put('/:id', requireAuth, userController.update);
router.delete('/:id', requireAuth, userController.remove);

export default router;
