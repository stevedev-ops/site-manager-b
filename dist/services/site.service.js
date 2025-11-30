"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteService = void 0;
const database_1 = __importDefault(require("../config/database"));
const types_1 = require("../types");
class SiteService {
    async create(data) {
        const site = await database_1.default.site.create({
            data: {
                ...data,
                status: 'ACTIVE',
            },
            include: {
                organization: {
                    select: { name: true },
                },
            },
        });
        return site;
    }
    async findAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.organizationId)
            where.organizationId = params.organizationId;
        // If user is not admin/super admin, only show assigned sites
        if (params.userId && params.role !== types_1.UserRole.SUPER_ADMIN && params.role !== types_1.UserRole.ADMIN) {
            where.siteUsers = {
                some: {
                    userId: params.userId,
                },
            };
        }
        const [sites, total] = await Promise.all([
            database_1.default.site.findMany({
                where,
                skip,
                take: limit,
                include: {
                    organization: {
                        select: { name: true },
                    },
                    _count: {
                        select: { siteUsers: true, reports: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            database_1.default.site.count({ where }),
        ]);
        return {
            data: sites,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        const site = await database_1.default.site.findUnique({
            where: { id },
            include: {
                organization: {
                    select: { name: true },
                },
                siteUsers: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                },
                _count: {
                    select: { reports: true, tasks: true },
                },
            },
        });
        if (!site) {
            throw new Error('Site not found');
        }
        return site;
    }
    async update(id, data) {
        const site = await database_1.default.site.update({
            where: { id },
            data,
        });
        return site;
    }
    async delete(id) {
        await database_1.default.site.delete({
            where: { id },
        });
        return { message: 'Site deleted successfully' };
    }
    async assignUser(siteId, userId, role) {
        // Check if user is already assigned
        const existingAssignment = await database_1.default.siteUser.findFirst({
            where: { siteId, userId },
        });
        if (existingAssignment) {
            throw new Error('User already assigned to this site');
        }
        const assignment = await database_1.default.siteUser.create({
            data: {
                siteId,
                userId,
                role,
            },
            include: {
                user: {
                    select: { name: true, email: true },
                },
            },
        });
        return assignment;
    }
    async removeUser(siteId, userId) {
        await database_1.default.siteUser.deleteMany({
            where: { siteId, userId },
        });
        return { message: 'User removed from site' };
    }
}
exports.SiteService = SiteService;
//# sourceMappingURL=site.service.js.map