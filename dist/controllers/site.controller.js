"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteController = void 0;
const site_service_1 = require("../services/site.service");
const types_1 = require("../types");
const siteService = new site_service_1.SiteService();
class SiteController {
    async create(req, res) {
        try {
            // Ensure organizationId is set correctly
            if (req.user?.role !== types_1.UserRole.SUPER_ADMIN) {
                req.body.organizationId = req.user?.organizationId;
            }
            const site = await siteService.create(req.body);
            res.status(201).json({ success: true, data: site });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const result = await siteService.findAll({
                page,
                limit,
                organizationId,
                userId: req.user?.id,
                role: req.user?.role
            });
            res.json({ success: true, ...result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async findById(req, res) {
        try {
            const site = await siteService.findById(req.params.id);
            // Check permission
            if (req.user?.role !== types_1.UserRole.SUPER_ADMIN &&
                site.organizationId !== req.user?.organizationId) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }
            res.json({ success: true, data: site });
        }
        catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    async update(req, res) {
        try {
            // Check permission
            const siteToUpdate = await siteService.findById(req.params.id);
            if (req.user?.role !== types_1.UserRole.SUPER_ADMIN &&
                siteToUpdate.organizationId !== req.user?.organizationId) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }
            const site = await siteService.update(req.params.id, req.body);
            res.json({ success: true, data: site });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async delete(req, res) {
        try {
            // Check permission
            const siteToDelete = await siteService.findById(req.params.id);
            if (req.user?.role !== types_1.UserRole.SUPER_ADMIN &&
                siteToDelete.organizationId !== req.user?.organizationId) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }
            await siteService.delete(req.params.id);
            res.json({ success: true, message: 'Site deleted' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async assignUser(req, res) {
        try {
            const { userId, role } = req.body;
            const assignment = await siteService.assignUser(req.params.id, userId, role);
            res.json({ success: true, data: assignment });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async removeUser(req, res) {
        try {
            await siteService.removeUser(req.params.id, req.params.userId);
            res.json({ success: true, message: 'User removed from site' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.SiteController = SiteController;
//# sourceMappingURL=site.controller.js.map