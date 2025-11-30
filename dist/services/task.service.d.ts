import { PaginationParams, PaginatedResponse } from '../types';
export declare class TaskService {
    create(data: any): Promise<{
        site: {
            name: string;
        };
        assignee: {
            email: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TaskStatus;
        siteId: string;
        description: string | null;
        title: string;
        dueDate: Date | null;
        priority: import(".prisma/client").$Enums.TaskPriority;
        assignedTo: string | null;
    }>;
    findAll(params: PaginationParams & {
        siteId?: string;
        assignedTo?: string;
        status?: string;
        priority?: string;
        organizationId?: string;
    }): Promise<PaginatedResponse<any>>;
    findById(id: string): Promise<{
        site: {
            name: string;
        };
        assignee: {
            email: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TaskStatus;
        siteId: string;
        description: string | null;
        title: string;
        dueDate: Date | null;
        priority: import(".prisma/client").$Enums.TaskPriority;
        assignedTo: string | null;
    }>;
    update(id: string, data: any): Promise<{
        site: {
            name: string;
        };
        assignee: {
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TaskStatus;
        siteId: string;
        description: string | null;
        title: string;
        dueDate: Date | null;
        priority: import(".prisma/client").$Enums.TaskPriority;
        assignedTo: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    updateStatus(id: string, status: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TaskStatus;
        siteId: string;
        description: string | null;
        title: string;
        dueDate: Date | null;
        priority: import(".prisma/client").$Enums.TaskPriority;
        assignedTo: string | null;
    }>;
}
//# sourceMappingURL=task.service.d.ts.map