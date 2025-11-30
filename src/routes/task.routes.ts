import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();
const controller = new TaskController();

router.use(authenticate);

// List tasks
router.get('/', controller.findAll);

// Create task (Admin, Supervisor)
router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR), controller.create);

// Get task details
router.get('/:id', controller.findById);

// Update task
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUPERVISOR), controller.update);

// Delete task
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), controller.delete);

// Update status (Assignee can also update status)
router.put('/:id/status', controller.updateStatus);

export default router;
