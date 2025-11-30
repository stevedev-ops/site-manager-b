"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceController = void 0;
const resource_service_1 = require("../services/resource.service");
const types_1 = require("../types");
const resourceService = new resource_service_1.ResourceService();
class ResourceController {
    // --- Templates ---
    async createTemplate(req, res) {
        try {
            if (req.user?.role !== types_1.UserRole.SUPER_ADMIN) {
                req.body.organizationId = req.user?.organizationId;
            }
            const template = await resourceService.createTemplate(req.body);
            res.status(201).json({ success: true, data: template });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async findAllTemplates(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const result = await resourceService.findAllTemplates({ page, limit, organizationId });
            res.json({ success: true, ...result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async updateTemplate(req, res) {
        try {
            const template = await resourceService.updateTemplate(req.params.id, req.body);
            res.json({ success: true, data: template });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async deleteTemplate(req, res) {
        try {
            await resourceService.deleteTemplate(req.params.id);
            res.json({ success: true, message: 'Template deleted' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    // --- Site Resources ---
    async getSiteResources(req, res) {
        try {
            const resources = await resourceService.getSiteResources(req.params.siteId);
            res.json({ success: true, data: resources });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async updateSiteResource(req, res) {
        try {
            const { templateId, quantity } = req.body;
            const resource = await resourceService.updateSiteResource(req.params.siteId, templateId, quantity, req.user.id);
            res.json({ success: true, data: resource });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.ResourceController = ResourceController;
//# sourceMappingURL=resource.controller.js.map