import { PaginationParams, PaginatedResponse } from '../types';
export declare class OrganizationService {
    create(data: {
        name: string;
        plan?: string;
    }): Promise<{
        subscription: {
            id: string;
            isActive: boolean;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            plan: string;
            startDate: Date;
            endDate: Date;
            maxUsers: number;
            maxSites: number;
        } | null;
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    }>;
    findAll(params: PaginationParams): Promise<PaginatedResponse<any>>;
    findById(id: string): Promise<{
        _count: {
            users: number;
            sites: number;
        };
        subscription: {
            id: string;
            isActive: boolean;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            plan: string;
            startDate: Date;
            endDate: Date;
            maxUsers: number;
            maxSites: number;
        } | null;
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    }>;
    update(id: string, data: {
        name?: string;
        plan?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        plan: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getStats(id: string): Promise<{
        users: number;
        sites: number;
        activeSites: number;
    }>;
}
//# sourceMappingURL=organization.service.d.ts.map