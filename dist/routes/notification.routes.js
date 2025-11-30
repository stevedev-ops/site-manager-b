"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new notification_controller_1.NotificationController();
router.use(auth_1.authenticate);
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
exports.default = router;
//# sourceMappingURL=notification.routes.js.map