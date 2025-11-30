import { Router } from 'express';
import { SiteController } from '../controllers/site.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();
const controller = new SiteController();

router.use(authenticate);

// List sites (filtered by role/org)
router.get('/', controller.findAll);

// Get specific site
router.get('/:id', controller.findById);

// Create site (Super Admin, Admin)
router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.create);

// Update site
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.update);

// Delete site
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.delete);

// Assign user to site
router.post('/:id/users', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.assignUser);

// Remove user from site
router.delete('/:id/users/:userId', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.removeUser);

export default router;
