"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const attendance_service_1 = require("../services/attendance.service");
const types_1 = require("../types");
const attendanceService = new attendance_service_1.AttendanceService();
class AttendanceController {
    async clockIn(req, res) {
        try {
            const { siteId, gpsLocation, selfieUrl } = req.body;
            const attendance = await attendanceService.clockIn(req.user.id, siteId, gpsLocation, selfieUrl);
            res.status(201).json({ success: true, data: attendance });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async clockOut(req, res) {
        try {
            const { attendanceId } = req.body;
            const attendance = await attendanceService.clockOut(req.user.id, attendanceId);
            res.json({ success: true, data: attendance });
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
            const userId = req.query.userId;
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const result = await attendanceService.findAll({
                page,
                limit,
                siteId,
                userId,
                organizationId
            });
            res.json({ success: true, ...result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async getCurrentStatus(req, res) {
        try {
            const status = await attendanceService.getCurrentStatus(req.user.id);
            res.json({ success: true, data: status });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.AttendanceController = AttendanceController;
//# sourceMappingURL=attendance.controller.js.map