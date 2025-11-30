import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();
const controller = new AnalyticsController();

router.use(authenticate);
router.use(authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUB_ADMIN));

// Get attendance statistics
router.get('/attendance', controller.getAttendanceStats);

// Get resource statistics
router.get('/resources', controller.getResourceStats);

// Get report statistics
router.get('/reports', controller.getReportStats);

// Get site statistics
router.get('/sites', controller.getSiteStats);

export default router;
