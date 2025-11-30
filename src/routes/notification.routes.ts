import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new NotificationController();

router.use(authenticate);

// Get all notifications for current user
router.get('/', controller.findAll);

// Get unread count
router.get('/unread-count', controller.getUnreadCount);

// Mark notification as read
router.put('/:id/read', controller.markAsRead);

// Mark all as read
router.put('/read-all', controller.markAllAsRead);

// Delete notification
router.delete('/:id', controller.delete);

export default router;
