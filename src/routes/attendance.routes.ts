import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();
const controller = new AttendanceController();

router.use(authenticate);

// Clock In
router.post('/clock-in', controller.clockIn);

// Clock Out
router.post('/clock-out', controller.clockOut);

// Get Current Status
router.get('/status', controller.getCurrentStatus);

// List Attendance (Admin, Super Admin)
router.get('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUB_ADMIN), controller.findAll);

export default router;
