"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class NotificationService {
    async create(data) {
        return prisma.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                message: data.message,
                metadata: data.metadata || null,
            },
        });
    }
    async createMany(notifications) {
        return prisma.notification.createMany({
            data: notifications.map(n => ({
                userId: n.userId,
                type: n.type,
                message: n.message,
                metadata: n.metadata || null,
            })),
        });
    }
    async findAll(filters) {
        const { userId, page = 1, limit = 20, unreadOnly = false } = filters;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (unreadOnly) {
            where.read = false;
        }
        const [data, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.notification.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async markAsRead(id, userId) {
        const notification = await prisma.notification.findFirst({
            where: { id, userId },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        return prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    async markAllAsRead(userId) {
        return prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }
    async delete(id, userId) {
        const notification = await prisma.notification.findFirst({
            where: { id, userId },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        return prisma.notification.delete({ where: { id } });
    }
    async getUnreadCount(userId) {
        return prisma.notification.count({
            where: { userId, read: false },
        });
    }
    // Helper methods for creating specific notification types
    async notifyLowResource(siteId, resourceName, quantity) {
        const site = await prisma.site.findUnique({
            where: { id: siteId },
            include: {
                siteUsers: {
                    where: {
                        role: { in: ['SITE_MANAGER', 'SUPERVISOR'] },
                    },
                    include: { user: true },
                },
            },
        });
        if (!site)
            return;
        const notifications = site.siteUsers.map(su => ({
            userId: su.userId,
            type: client_1.NotificationType.LOW_RESOURCE,
            message: `Low resource alert: ${resourceName} at ${site.name} is running low (${quantity} remaining)`,
            metadata: { siteId, resourceName, quantity },
        }));
        if (notifications.length > 0) {
            await this.createMany(notifications);
        }
    }
    async notifyReportSubmitted(reportId, siteId) {
        const site = await prisma.site.findUnique({
            where: { id: siteId },
            include: {
                siteUsers: {
                    where: {
                        role: { in: ['SITE_MANAGER', 'CLIENT'] },
                    },
                },
                organization: {
                    include: {
                        users: {
                            where: {
                                role: { in: ['ADMIN', 'SUB_ADMIN'] },
                            },
                        },
                    },
                },
            },
        });
        if (!site)
            return;
        const userIds = [
            ...site.siteUsers.map(su => su.userId),
            ...site.organization.users.map(u => u.id),
        ];
        const notifications = userIds.map(userId => ({
            userId,
            type: client_1.NotificationType.REPORT_SUBMITTED,
            message: `New report submitted for ${site.name}`,
            metadata: { reportId, siteId },
        }));
        if (notifications.length > 0) {
            await this.createMany(notifications);
        }
    }
    async notifyReportApproved(reportId, supervisorId, siteName) {
        await this.create({
            userId: supervisorId,
            type: client_1.NotificationType.REPORT_APPROVED,
            message: `Your report for ${siteName} has been approved`,
            metadata: { reportId },
        });
    }
    async notifyReportRejected(reportId, supervisorId, siteName) {
        await this.create({
            userId: supervisorId,
            type: client_1.NotificationType.REPORT_REJECTED,
            message: `Your report for ${siteName} has been rejected`,
            metadata: { reportId },
        });
    }
    async notifyTaskAssigned(taskId, assignedToId, taskTitle) {
        await this.create({
            userId: assignedToId,
            type: client_1.NotificationType.TASK_ASSIGNED,
            message: `You have been assigned a new task: ${taskTitle}`,
            metadata: { taskId },
        });
    }
    async notifyTaskDue(taskId, assignedToId, taskTitle) {
        await this.create({
            userId: assignedToId,
            type: client_1.NotificationType.TASK_DUE,
            message: `Task due soon: ${taskTitle}`,
            metadata: { taskId },
        });
    }
    async notifyCommentAdded(reportId, supervisorId, siteName) {
        await this.create({
            userId: supervisorId,
            type: client_1.NotificationType.COMMENT_ADDED,
            message: `New comment on your report for ${siteName}`,
            metadata: { reportId },
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map