import { NotificationType } from '@prisma/client';
import { PaginationParams, PaginatedResponse } from '../types';
interface NotificationFilters extends PaginationParams {
    userId: string;
    unreadOnly?: boolean;
}
export declare class NotificationService {
    create(data: {
        userId: string;
        type: NotificationType;
        message: string;
        metadata?: any;
    }): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        read: boolean;
    }>;
    createMany(notifications: Array<{
        userId: string;
        type: NotificationType;
        message: string;
        metadata?: any;
    }>): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findAll(filters: NotificationFilters): Promise<PaginatedResponse<any>>;
    markAsRead(id: string, userId: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        read: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(id: string, userId: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        read: boolean;
    }>;
    getUnreadCount(userId: string): Promise<number>;
    notifyLowResource(siteId: string, resourceName: string, quantity: number): Promise<void>;
    notifyReportSubmitted(reportId: string, siteId: string): Promise<void>;
    notifyReportApproved(reportId: string, supervisorId: string, siteName: string): Promise<void>;
    notifyReportRejected(reportId: string, supervisorId: string, siteName: string): Promise<void>;
    notifyTaskAssigned(taskId: string, assignedToId: string, taskTitle: string): Promise<void>;
    notifyTaskDue(taskId: string, assignedToId: string, taskTitle: string): Promise<void>;
    notifyCommentAdded(reportId: string, supervisorId: string, siteName: string): Promise<void>;
}
export {};
//# sourceMappingURL=notification.service.d.ts.map