import { Router } from 'express';
import { MilestoneController } from '../controllers/milestone.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();
const controller = new MilestoneController();

router.use(authenticate);

// List milestones
router.get('/', controller.findAll);

// Get milestone by ID
router.get('/:id', controller.findById);

// Create milestone (Admin, Sub-Admin only)
router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUB_ADMIN), controller.create);

// Update milestone
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUB_ADMIN), controller.update);

// Update progress
router.patch('/:id/progress', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.SUPERVISOR), controller.updateProgress);

// Delete milestone
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUB_ADMIN), controller.delete);

export default router;
