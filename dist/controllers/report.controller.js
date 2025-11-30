"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const report_service_1 = require("../services/report.service");
const types_1 = require("../types");
const reportService = new report_service_1.ReportService();
class ReportController {
    async create(req, res) {
        try {
            const report = await reportService.create({
                ...req.body,
                supervisorId: req.user.id,
            });
            res.status(201).json({ success: true, data: report });
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
            const supervisorId = req.query.supervisorId;
            const status = req.query.status;
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const result = await reportService.findAll({
                page,
                limit,
                siteId,
                supervisorId,
                status,
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
            const report = await reportService.findById(req.params.id);
            res.json({ success: true, data: report });
        }
        catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const report = await reportService.updateStatus(req.params.id, status, req.user.id);
            res.json({ success: true, data: report });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async addComment(req, res) {
        try {
            const { content } = req.body;
            const comment = await reportService.addComment(req.params.id, req.user.id, content);
            res.json({ success: true, data: comment });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async addPhoto(req, res) {
        try {
            // Assuming file upload middleware has processed the file and put url in req.file.path or similar
            // For now, we'll expect url in body for simplicity or handle file upload separately
            const { url, caption } = req.body;
            const photo = await reportService.addPhoto(req.params.id, url, caption);
            res.json({ success: true, data: photo });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=report.controller.js.map