"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const notificationService = new notification_service_1.NotificationService();
class NotificationController {
    async findAll(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const unreadOnly = req.query.unreadOnly === 'true';
            const result = await notificationService.findAll({
                userId: req.user.id,
                page,
                limit,
                unreadOnly
            });
            res.json({ success: true, ...result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async markAsRead(req, res) {
        try {
            const notification = await notificationService.markAsRead(req.params.id, req.user.id);
            res.json({ success: true, data: notification });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async markAllAsRead(req, res) {
        try {
            await notificationService.markAllAsRead(req.user.id);
            res.json({ success: true, message: 'All notifications marked as read' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await notificationService.delete(req.params.id, req.user.id);
            res.json({ success: true, message: 'Notification deleted' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async getUnreadCount(req, res) {
        try {
            const count = await notificationService.getUnreadCount(req.user.id);
            res.json({ success: true, data: { count } });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map