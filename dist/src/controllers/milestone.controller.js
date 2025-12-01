"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestoneController = void 0;
const milestone_service_1 = require("../services/milestone.service");
const types_1 = require("../types");
const milestoneService = new milestone_service_1.MilestoneService();
class MilestoneController {
    async create(req, res) {
        try {
            const milestone = await milestoneService.create(req.body);
            res.status(201).json({ success: true, data: milestone });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const siteId = req.query.siteId;
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const result = await milestoneService.findAll({
                page,
                limit,
                siteId,
                organizationId
            });
            res.json({ success: true, ...result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async findById(req, res) {
        try {
            const milestone = await milestoneService.findById(req.params.id);
            res.json({ success: true, data: milestone });
        }
        catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    async update(req, res) {
        try {
            const milestone = await milestoneService.update(req.params.id, req.body);
            res.json({ success: true, data: milestone });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await milestoneService.delete(req.params.id);
            res.json({ success: true, message: 'Milestone deleted' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async updateProgress(req, res) {
        try {
            const { percentComplete } = req.body;
            const milestone = await milestoneService.updateProgress(req.params.id, percentComplete);
            res.json({ success: true, data: milestone });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.MilestoneController = MilestoneController;
//# sourceMappingURL=milestone.controller.js.map