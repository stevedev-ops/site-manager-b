"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const database_1 = __importDefault(require("../config/database"));
class OrganizationService {
    async create(data) {
        const organization = await database_1.default.organization.create({
            data: {
                name: data.name,
                plan: data.plan || 'FREE',
                subscription: {
                    create: {
                        plan: data.plan || 'FREE',
                        startDate: new Date(),
                        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                        isActive: true,
                    },
                },
            },
            include: {
                subscription: true,
            },
        });
        return organization;
    }
    async findAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        const [organizations, total] = await Promise.all([
            database_1.default.organization.findMany({
                skip,
                take: limit,
                include: {
                    _count: {
                        select: { users: true, sites: true },
                    },
                    subscription: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            database_1.default.organization.count(),
        ]);
        return {
            data: organizations,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        const organization = await database_1.default.organization.findUnique({
            where: { id },
            include: {
                subscription: true,
                _count: {
                    select: { users: true, sites: true },
                },
            },
        });
        if (!organization) {
            throw new Error('Organization not found');
        }
        return organization;
    }
    async update(id, data) {
        const organization = await database_1.default.organization.update({
            where: { id },
            data: {
                name: data.name,
                plan: data.plan,
                isActive: data.isActive,
            },
        });
        return organization;
    }
    async delete(id) {
        await database_1.default.organization.delete({
            where: { id },
        });
        return { message: 'Organization deleted successfully' };
    }
    async getStats(id) {
        const [usersCount, sitesCount, activeSitesCount] = await Promise.all([
            database_1.default.user.count({ where: { organizationId: id } }),
            database_1.default.site.count({ where: { organizationId: id } }),
            database_1.default.site.count({ where: { organizationId: id, status: 'ACTIVE' } }),
        ]);
        return {
            users: usersCount,
            sites: sitesCount,
            activeSites: activeSitesCount,
        };
    }
}
exports.OrganizationService = OrganizationService;
//# sourceMappingURL=organization.service.js.map