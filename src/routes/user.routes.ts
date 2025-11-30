import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();
const controller = new UserController();

router.use(authenticate);

// List users (Super Admin sees all, Admin sees org users)
router.get('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.findAll);

// Get specific user
router.get('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.findById);

// Create user
router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.create);

// Update user
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.update);

// Delete user
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.delete);

export default router;
