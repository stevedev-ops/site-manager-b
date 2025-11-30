import prisma from '../config/database';
import { PaginationParams, PaginatedResponse, UserRole } from '../types';

export class ResourceService {
    // --- Resource Templates ---

    async createTemplate(data: any) {
        const template = await prisma.resourceTemplate.create({
            data,
        });
        return template;
    }

    async findAllTemplates(
        params: PaginationParams & { organizationId?: string }
    ): Promise<PaginatedResponse<any>> {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (params.organizationId) where.organizationId = params.organizationId;

        const [templates, total] = await Promise.all([
            prisma.resourceTemplate.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            prisma.resourceTemplate.count({ where }),
        ]);

        return {
            data: templates,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateTemplate(id: string, data: any) {
        const template = await prisma.resourceTemplate.update({
            where: { id },
            data,
        });
        return template;
    }

    async deleteTemplate(id: string) {
        await prisma.resourceTemplate.delete({
            where: { id },
        });
        return { message: 'Resource template deleted successfully' };
    }

    // --- Site Resources ---

    async getSiteResources(siteId: string) {
        const resources = await prisma.resource.findMany({
            where: { siteId },
            include: {
                template: true,
            },
            orderBy: { template: { name: 'asc' } },
        });
        return resources;
    }

    async updateSiteResource(siteId: string, templateId: string, quantity: number, userId: string) {
        // Check if resource exists for this site
        const existingResource = await prisma.resource.findFirst({
            where: { siteId, templateId },
        });

        let resource;

        if (existingResource) {
            resource = await prisma.resource.update({
                where: { id: existingResource.id },
                data: {
                    quantity,
                    lastUpdated: new Date(),
                    updatedBy: userId,
                },
                include: { template: true },
            });
        } else {
            resource = await prisma.resource.create({
                data: {
                    siteId,
                    templateId,
                    quantity,
                    updatedBy: userId,
                },
                include: { template: true },
            });
        }

        return resource;
    }

    async getResourceHistory(siteId: string, templateId?: string) {
        // In a real app, we'd query an audit log or a history table
        // For now, we'll just return the current state as a placeholder
        // or implement a proper history table if needed.
        // Given the schema, we don't have a dedicated ResourceHistory table yet,
        // but we have AuditLog.

        // Returning current resources for now
        return this.getSiteResources(siteId);
    }
}
