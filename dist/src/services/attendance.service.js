"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const database_1 = __importDefault(require("../config/database"));
const gps_1 = require("../utils/gps");
class AttendanceService {
    async clockIn(userId, siteId, gpsLocation, selfieUrl) {
        // 1. Check if user is already clocked in
        const existingAttendance = await database_1.default.attendance.findFirst({
            where: {
                userId,
                clockOut: null,
            },
        });
        if (existingAttendance) {
            throw new Error('User is already clocked in');
        }
        // 2. Verify GPS location
        const site = await database_1.default.site.findUnique({
            where: { id: siteId },
        });
        if (!site) {
            throw new Error('Site not found');
        }
        // Parse site GPS coordinates
        // Assuming site.gpsCoordinates is stored as JSON: { lat: number, lng: number }
        const siteLocation = site.gpsCoordinates;
        let verified = false;
        if (siteLocation && siteLocation.lat && siteLocation.lng) {
            verified = (0, gps_1.verifySiteLocation)({ latitude: gpsLocation.lat, longitude: gpsLocation.lng }, { latitude: siteLocation.lat, longitude: siteLocation.lng });
        }
        else {
            // If site has no GPS set, we can't verify, but we might allow clock-in with a warning flag
            // For now, let's mark as unverified
            verified = false;
        }
        // 3. Create attendance record
        const attendance = await database_1.default.attendance.create({
            data: {
                userId,
                siteId,
                clockIn: new Date(),
                gpsLocation: gpsLocation,
                selfieUrl,
                verified,
            },
            include: {
                site: { select: { name: true } },
                user: { select: { name: true } },
            },
        });
        return attendance;
    }
    async clockOut(userId, attendanceId) {
        const attendance = await database_1.default.attendance.findFirst({
            where: {
                id: attendanceId,
                userId,
                clockOut: null,
            },
        });
        if (!attendance) {
            throw new Error('Active attendance record not found');
        }
        const updatedAttendance = await database_1.default.attendance.update({
            where: { id: attendanceId },
            data: {
                clockOut: new Date(),
            },
        });
        return updatedAttendance;
    }
    async findAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.siteId)
            where.siteId = params.siteId;
        if (params.userId)
            where.userId = params.userId;
        // Filter by organization if provided (for admins)
        if (params.organizationId) {
            where.user = {
                organizationId: params.organizationId
            };
        }
        if (params.startDate || params.endDate) {
            where.clockIn = {};
            if (params.startDate)
                where.clockIn.gte = params.startDate;
            if (params.endDate)
                where.clockIn.lte = params.endDate;
        }
        const [attendance, total] = await Promise.all([
            database_1.default.attendance.findMany({
                where,
                skip,
                take: limit,
                include: {
                    site: { select: { name: true } },
                    user: { select: { name: true, email: true } },
                },
                orderBy: { clockIn: 'desc' },
            }),
            database_1.default.attendance.count({ where }),
        ]);
        return {
            data: attendance,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getCurrentStatus(userId) {
        const activeAttendance = await database_1.default.attendance.findFirst({
            where: {
                userId,
                clockOut: null,
            },
            include: {
                site: { select: { name: true, id: true } },
            },
        });
        return activeAttendance;
    }
}
exports.AttendanceService = AttendanceService;
//# sourceMappingURL=attendance.service.js.map