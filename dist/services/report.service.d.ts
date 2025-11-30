import { PaginationParams, PaginatedResponse, UserRole } from '../types';
export declare class ReportService {
    create(data: any): Promise<{
        site: {
            name: string;
        };
        supervisor: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        siteId: string;
        reportDate: Date;
        workersPresent: number;
        description: string;
        resourcesUsed: import("@prisma/client/runtime/library").JsonValue | null;
        approvedAt: Date | null;
        supervisorId: string;
        approvedBy: string | null;
    }>;
    findAll(params: PaginationParams & {
        siteId?: string;
        supervisorId?: string;
        status?: string;
        organizationId?: string;
        userId?: string;
        role?: UserRole;
    }): Promise<PaginatedResponse<any>>;
    findById(id: string): Promise<{
        comments: ({
            user: {
                name: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            reportId: string;
        })[];
        site: {
            name: string;
        };
        supervisor: {
            name: string;
        };
        photos: {
            id: string;
            reportId: string;
            url: string;
            caption: string | null;
            uploadedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        siteId: string;
        reportDate: Date;
        workersPresent: number;
        description: string;
        resourcesUsed: import("@prisma/client/runtime/library").JsonValue | null;
        approvedAt: Date | null;
        supervisorId: string;
        approvedBy: string | null;
    }>;
    updateStatus(id: string, status: 'APPROVED' | 'REJECTED', userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        siteId: string;
        reportDate: Date;
        workersPresent: number;
        description: string;
        resourcesUsed: import("@prisma/client/runtime/library").JsonValue | null;
        approvedAt: Date | null;
        supervisorId: string;
        approvedBy: string | null;
    }>;
    addComment(reportId: string, userId: string, content: string): Promise<{
        user: {
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        reportId: string;
    }>;
    addPhoto(reportId: string, url: string, caption?: string): Promise<{
        id: string;
        reportId: string;
        url: string;
        caption: string | null;
        uploadedAt: Date;
    }>;
}
//# sourceMappingURL=report.service.d.ts.map