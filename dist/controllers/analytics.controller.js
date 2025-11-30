"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const client_1 = require("@prisma/client");
const types_1 = require("../types");
const prisma = new client_1.PrismaClient();
class AnalyticsController {
    async getAttendanceStats(req, res) {
        try {
            const { startDate, endDate, siteId } = req.query;
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const where = {};
            if (startDate && endDate) {
                where.clockIn = {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                };
            }
            if (siteId) {
                where.siteId = siteId;
            }
            if (organizationId) {
                where.site = {
                    organizationId,
                };
            }
            const attendanceRecords = await prisma.attendance.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                        },
                    },
                    site: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: { clockIn: 'desc' },
            });
            // Calculate statistics
            const totalRecords = attendanceRecords.length;
            const totalHours = attendanceRecords.reduce((sum, record) => sum + (record.hoursWorked || 0), 0);
            const averageHours = totalRecords > 0 ? totalHours / totalRecords : 0;
            // Group by date
            const byDate = {};
            attendanceRecords.forEach(record => {
                const date = record.clockIn.toISOString().split('T')[0];
                byDate[date] = (byDate[date] || 0) + 1;
            });
            res.json({
                success: true,
                data: {
                    totalRecords,
                    totalHours: Math.round(totalHours * 100) / 100,
                    averageHours: Math.round(averageHours * 100) / 100,
                    byDate,
                    records: attendanceRecords,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async getResourceStats(req, res) {
        try {
            const { siteId } = req.query;
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const where = {};
            if (siteId) {
                where.siteId = siteId;
            }
            if (organizationId) {
                where.site = {
                    organizationId,
                };
            }
            const resources = await prisma.resource.findMany({
                where,
                include: {
                    template: true,
                    site: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            // Calculate low resource alerts
            const lowResources = resources.filter(r => r.quantity <= r.template.alertThreshold);
            // Group by template
            const byTemplate = {};
            resources.forEach(resource => {
                const templateName = resource.template.name;
                if (!byTemplate[templateName]) {
                    byTemplate[templateName] = { total: 0, sites: 0 };
                }
                byTemplate[templateName].total += resource.quantity;
                byTemplate[templateName].sites += 1;
            });
            res.json({
                success: true,
                data: {
                    totalResources: resources.length,
                    lowResourcesCount: lowResources.length,
                    lowResources,
                    byTemplate,
                    resources,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async getReportStats(req, res) {
        try {
            const { startDate, endDate, siteId } = req.query;
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const where = {};
            if (startDate && endDate) {
                where.reportDate = {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                };
            }
            if (siteId) {
                where.siteId = siteId;
            }
            if (organizationId) {
                where.site = {
                    organizationId,
                };
            }
            const reports = await prisma.report.findMany({
                where,
                include: {
                    site: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    supervisor: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            // Calculate statistics
            const totalReports = reports.length;
            const byStatus = {
                DRAFT: reports.filter(r => r.status === 'DRAFT').length,
                SUBMITTED: reports.filter(r => r.status === 'SUBMITTED').length,
                APPROVED: reports.filter(r => r.status === 'APPROVED').length,
                REJECTED: reports.filter(r => r.status === 'REJECTED').length,
            };
            // Group by date
            const byDate = {};
            reports.forEach(report => {
                const date = report.reportDate.toISOString().split('T')[0];
                byDate[date] = (byDate[date] || 0) + 1;
            });
            res.json({
                success: true,
                data: {
                    totalReports,
                    byStatus,
                    byDate,
                    reports,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async getSiteStats(req, res) {
        try {
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const where = {};
            if (organizationId) {
                where.organizationId = organizationId;
            }
            const sites = await prisma.site.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            siteUsers: true,
                            reports: true,
                            tasks: true,
                            milestones: true,
                        },
                    },
                    milestones: {
                        select: {
                            percentComplete: true,
                        },
                    },
                },
            });
            // Calculate statistics
            const totalSites = sites.length;
            const byStatus = {
                PLANNING: sites.filter(s => s.status === 'PLANNING').length,
                ACTIVE: sites.filter(s => s.status === 'ACTIVE').length,
                ON_HOLD: sites.filter(s => s.status === 'ON_HOLD').length,
                COMPLETED: sites.filter(s => s.status === 'COMPLETED').length,
                CANCELLED: sites.filter(s => s.status === 'CANCELLED').length,
            };
            // Calculate average progress
            const sitesWithProgress = sites.map(site => {
                const avgProgress = site.milestones.length > 0
                    ? site.milestones.reduce((sum, m) => sum + m.percentComplete, 0) / site.milestones.length
                    : 0;
                return {
                    ...site,
                    averageProgress: Math.round(avgProgress),
                };
            });
            res.json({
                success: true,
                data: {
                    totalSites,
                    byStatus,
                    sites: sitesWithProgress,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map