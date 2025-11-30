"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const database_1 = __importDefault(require("../config/database"));
class ReportService {
    async create(data) {
        const report = await database_1.default.report.create({
            data: {
                ...data,
                status: 'PENDING',
            },
            include: {
                site: { select: { name: true } },
                supervisor: { select: { name: true } },
            },
        });
        return report;
    }
    async findAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.siteId)
            where.siteId = params.siteId;
        if (params.supervisorId)
            where.supervisorId = params.supervisorId;
        if (params.status)
            where.status = params.status;
        // Filter by organization
        if (params.organizationId) {
            where.supervisor = {
                organizationId: params.organizationId
            };
        }
        const [reports, total] = await Promise.all([
            database_1.default.report.findMany({
                where,
                skip,
                take: limit,
                include: {
                    site: { select: { name: true } },
                    supervisor: { select: { name: true } },
                    _count: { select: { photos: true, comments: true } },
                },
                orderBy: { reportDate: 'desc' },
            }),
            database_1.default.report.count({ where }),
        ]);
        return {
            data: reports,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        const report = await database_1.default.report.findUnique({
            where: { id },
            include: {
                site: { select: { name: true } },
                supervisor: { select: { name: true } },
                photos: true,
                comments: {
                    include: {
                        user: { select: { name: true, role: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!report) {
            throw new Error('Report not found');
        }
        return report;
    }
    async updateStatus(id, status, userId) {
        const report = await database_1.default.report.update({
            where: { id },
            data: {
                status,
                approvedBy: status === 'APPROVED' ? userId : null,
                approvedAt: status === 'APPROVED' ? new Date() : null,
            },
        });
        return report;
    }
    async addComment(reportId, userId, content) {
        const comment = await database_1.default.comment.create({
            data: {
                reportId,
                userId,
                content,
            },
            include: {
                user: { select: { name: true, role: true } },
            },
        });
        return comment;
    }
    async addPhoto(reportId, url, caption) {
        const photo = await database_1.default.reportPhoto.create({
            data: {
                reportId,
                url,
                caption,
            },
        });
        return photo;
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map