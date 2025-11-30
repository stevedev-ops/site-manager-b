import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export class NotificationController {
    async findAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const unreadOnly = req.query.unreadOnly === 'true';

            const result = await notificationService.findAll({
                userId: req.user!.id,
                page,
                limit,
                unreadOnly
            });
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async markAsRead(req: Request, res: Response) {
        try {
            const notification = await notificationService.markAsRead(
                req.params.id,
                req.user!.id
            );
            res.json({ success: true, data: notification });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async markAllAsRead(req: Request, res: Response) {
        try {
            await notificationService.markAllAsRead(req.user!.id);
            res.json({ success: true, message: 'All notifications marked as read' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await notificationService.delete(req.params.id, req.user!.id);
            res.json({ success: true, message: 'Notification deleted' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async getUnreadCount(req: Request, res: Response) {
        try {
            const count = await notificationService.getUnreadCount(req.user!.id);
            res.json({ success: true, data: { count } });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
