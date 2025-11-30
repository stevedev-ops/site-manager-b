import { UserRole, PaginationParams, PaginatedResponse } from '../types';
export declare class UserService {
    create(data: any): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        organizationId: string | null;
        createdAt: Date;
    }>;
    findAll(params: PaginationParams & {
        role?: UserRole;
        organizationId?: string;
    }): Promise<PaginatedResponse<any>>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        organizationId: string | null;
        createdAt: Date;
        organization: {
            name: string;
        } | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
        organizationId: string | null;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map