import { PaginationParams, PaginatedResponse, UserRole } from '../types';
export declare class SiteService {
    create(data: any): Promise<{
        organization: {
            name: string;
        };
    } & {
        id: string;
        name: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        status: import(".prisma/client").$Enums.SiteStatus;
        location: string;
        gpsCoordinates: import("@prisma/client/runtime/library").JsonValue | null;
        expectedEndDate: Date | null;
        actualEndDate: Date | null;
    }>;
    findAll(params: PaginationParams & {
        organizationId?: string;
        userId?: string;
        role?: UserRole;
    }): Promise<PaginatedResponse<any>>;
    findById(id: string): Promise<{
        organization: {
            name: string;
        };
        _count: {
            reports: number;
            tasks: number;
        };
        siteUsers: ({
            user: {
                id: string;
                email: string;
                name: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.SiteUserRole;
            siteId: string;
            userId: string;
            assignedAt: Date;
        })[];
    } & {
        id: string;
        name: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        status: import(".prisma/client").$Enums.SiteStatus;
        location: string;
        gpsCoordinates: import("@prisma/client/runtime/library").JsonValue | null;
        expectedEndDate: Date | null;
        actualEndDate: Date | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        status: import(".prisma/client").$Enums.SiteStatus;
        location: string;
        gpsCoordinates: import("@prisma/client/runtime/library").JsonValue | null;
        expectedEndDate: Date | null;
        actualEndDate: Date | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    assignUser(siteId: string, userId: string, role: any): Promise<{
        user: {
            email: string;
            name: string;
        };
    } & {
        id: string;
        role: import(".prisma/client").$Enums.SiteUserRole;
        siteId: string;
        userId: string;
        assignedAt: Date;
    }>;
    removeUser(siteId: string, userId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=site.service.d.ts.map