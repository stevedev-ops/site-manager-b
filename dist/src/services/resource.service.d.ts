import { PaginationParams, PaginatedResponse } from '../types';
export declare class ResourceService {
    createTemplate(data: any): Promise<{
        id: string;
        name: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        alertThreshold: number;
    }>;
    findAllTemplates(params: PaginationParams & {
        organizationId?: string;
    }): Promise<PaginatedResponse<any>>;
    updateTemplate(id: string, data: any): Promise<{
        id: string;
        name: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        alertThreshold: number;
    }>;
    deleteTemplate(id: string): Promise<{
        message: string;
    }>;
    getSiteResources(siteId: string): Promise<({
        template: {
            id: string;
            name: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            unit: string;
            alertThreshold: number;
        };
    } & {
        id: string;
        siteId: string;
        templateId: string;
        quantity: number;
        lastUpdated: Date;
        updatedBy: string;
    })[]>;
    updateSiteResource(siteId: string, templateId: string, quantity: number, userId: string): Promise<{
        template: {
            id: string;
            name: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            unit: string;
            alertThreshold: number;
        };
    } & {
        id: string;
        siteId: string;
        templateId: string;
        quantity: number;
        lastUpdated: Date;
        updatedBy: string;
    }>;
    getResourceHistory(siteId: string, templateId?: string): Promise<({
        template: {
            id: string;
            name: string;
            organizationId: string;
            createdAt: Date;
            updatedAt: Date;
            unit: string;
            alertThreshold: number;
        };
    } & {
        id: string;
        siteId: string;
        templateId: string;
        quantity: number;
        lastUpdated: Date;
        updatedBy: string;
    })[]>;
}
//# sourceMappingURL=resource.service.d.ts.map