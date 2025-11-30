import { Router } from 'express';
import authRoutes from './auth.routes';

import organizationRoutes from './organization.routes';
import userRoutes from './user.routes';
import siteRoutes from './site.routes';
import resourceRoutes from './resource.routes';
import attendanceRoutes from './attendance.routes';
import reportRoutes from './report.routes';
import taskRoutes from './task.routes';
import documentRoutes from './document.routes';
import logRoutes from './log.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/organizations', organizationRoutes);
router.use('/users', userRoutes);
router.use('/sites', siteRoutes);
router.use('/resources', resourceRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/reports', reportRoutes);
router.use('/tasks', taskRoutes);
router.use('/documents', documentRoutes);
router.use('/logs', logRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
