import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();
const controller = new OrganizationController();

// All routes require authentication
router.use(authenticate);

// Only Super Admin can manage organizations
router.post('/', authorize(UserRole.SUPER_ADMIN), controller.create);
router.get('/', authorize(UserRole.SUPER_ADMIN), controller.findAll);
router.get('/:id', authorize(UserRole.SUPER_ADMIN), controller.findById);
router.put('/:id', authorize(UserRole.SUPER_ADMIN), controller.update);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN), controller.delete);
router.get('/:id/stats', authorize(UserRole.SUPER_ADMIN), controller.getStats);

export default router;
