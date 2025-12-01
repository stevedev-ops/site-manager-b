import { PaginationParams, PaginatedResponse } from '../types';
interface MilestoneFilters extends PaginationParams {
    siteId?: string;
    organizationId?: string;
}
export declare class MilestoneService {
    create(data: {
        siteId: string;
        title: string;
        description?: string;
        targetDate: Date | string;
        percentComplete?: number;
    }): Promise<{
        site: {
            id: string;
            name: string;
            location: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        siteId: string;
        description: string | null;
        title: string;
        targetDate: Date;
        completedDate: Date | null;
        percentComplete: number;
    }>;
    findAll(filters: MilestoneFilters): Promise<PaginatedResponse<any>>;
    findById(id: string): Promise<{
        site: {
            id: string;
            name: string;
            location: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        siteId: string;
        description: string | null;
        title: string;
        targetDate: Date;
        completedDate: Date | null;
        percentComplete: number;
    }>;
    update(id: string, data: {
        title?: string;
        description?: string;
        targetDate?: Date | string;
        percentComplete?: number;
        completedDate?: Date | string | null;
    }): Promise<{
        site: {
            id: string;
            name: string;
            location: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        siteId: string;
        description: string | null;
        title: string;
        targetDate: Date;
        completedDate: Date | null;
        percentComplete: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        siteId: string;
        description: string | null;
        title: string;
        targetDate: Date;
        completedDate: Date | null;
        percentComplete: number;
    }>;
    updateProgress(id: string, percentComplete: number): Promise<{
        site: {
            id: string;
            name: string;
            location: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        siteId: string;
        description: string | null;
        title: string;
        targetDate: Date;
        completedDate: Date | null;
        percentComplete: number;
    }>;
}
export {};
//# sourceMappingURL=milestone.service.d.ts.map