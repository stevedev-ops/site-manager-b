import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();
const controller = new ReportController();

router.use(authenticate);

// List reports
router.get('/', controller.findAll);

// Create report (Supervisor only)
router.post('/', authorize(UserRole.SUPERVISOR), controller.create);

// Get report details
router.get('/:id', controller.findById);

// Update report status (Admin only)
router.put('/:id/status', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUB_ADMIN), controller.updateStatus);

// Add comment
router.post('/:id/comments', controller.addComment);

// Add photo
router.post('/:id/photos', controller.addPhoto);

export default router;
