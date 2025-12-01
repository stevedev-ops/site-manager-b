"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const organization_service_1 = require("../services/organization.service");
const organizationService = new organization_service_1.OrganizationService();
class OrganizationController {
    async create(req, res) {
        try {
            const { name, plan } = req.body;
            const organization = await organizationService.create({ name, plan });
            res.status(201).json({ success: true, data: organization });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await organizationService.findAll({ page, limit });
            res.json({ success: true, ...result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async findById(req, res) {
        try {
            const organization = await organizationService.findById(req.params.id);
            res.json({ success: true, data: organization });
        }
        catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    async update(req, res) {
        try {
            const organization = await organizationService.update(req.params.id, req.body);
            res.json({ success: true, data: organization });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await organizationService.delete(req.params.id);
            res.json({ success: true, message: 'Organization deleted' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async getStats(req, res) {
        try {
            const stats = await organizationService.getStats(req.params.id);
            res.json({ success: true, data: stats });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=organization.controller.js.map