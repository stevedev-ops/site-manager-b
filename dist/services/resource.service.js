"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceService = void 0;
const database_1 = __importDefault(require("../config/database"));
class ResourceService {
    // --- Resource Templates ---
    async createTemplate(data) {
        const template = await database_1.default.resourceTemplate.create({
            data,
        });
        return template;
    }
    async findAllTemplates(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.organizationId)
            where.organizationId = params.organizationId;
        const [templates, total] = await Promise.all([
            database_1.default.resourceTemplate.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            database_1.default.resourceTemplate.count({ where }),
        ]);
        return {
            data: templates,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async updateTemplate(id, data) {
        const template = await database_1.default.resourceTemplate.update({
            where: { id },
            data,
        });
        return template;
    }
    async deleteTemplate(id) {
        await database_1.default.resourceTemplate.delete({
            where: { id },
        });
        return { message: 'Resource template deleted successfully' };
    }
    // --- Site Resources ---
    async getSiteResources(siteId) {
        const resources = await database_1.default.resource.findMany({
            where: { siteId },
            include: {
                template: true,
            },
            orderBy: { template: { name: 'asc' } },
        });
        return resources;
    }
    async updateSiteResource(siteId, templateId, quantity, userId) {
        // Check if resource exists for this site
        const existingResource = await database_1.default.resource.findFirst({
            where: { siteId, templateId },
        });
        let resource;
        if (existingResource) {
            resource = await database_1.default.resource.update({
                where: { id: existingResource.id },
                data: {
                    quantity,
                    lastUpdated: new Date(),
                    updatedBy: userId,
                },
                include: { template: true },
            });
        }
        else {
            resource = await database_1.default.resource.create({
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
    async getResourceHistory(siteId, templateId) {
        // In a real app, we'd query an audit log or a history table
        // For now, we'll just return the current state as a placeholder
        // or implement a proper history table if needed.
        // Given the schema, we don't have a dedicated ResourceHistory table yet,
        // but we have AuditLog.
        // Returning current resources for now
        return this.getSiteResources(siteId);
    }
}
exports.ResourceService = ResourceService;
//# sourceMappingURL=resource.service.js.map