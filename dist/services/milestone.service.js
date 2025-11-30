"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestoneService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class MilestoneService {
    async create(data) {
        return prisma.milestone.create({
            data: {
                siteId: data.siteId,
                title: data.title,
                description: data.description,
                targetDate: new Date(data.targetDate),
                percentComplete: data.percentComplete || 0,
            },
            include: {
                site: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
            },
        });
    }
    async findAll(filters) {
        const { page = 1, limit = 10, siteId, organizationId } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (siteId) {
            where.siteId = siteId;
        }
        if (organizationId) {
            where.site = {
                organizationId,
            };
        }
        const [data, total] = await Promise.all([
            prisma.milestone.findMany({
                where,
                skip,
                take: limit,
                orderBy: { targetDate: 'asc' },
                include: {
                    site: {
                        select: {
                            id: true,
                            name: true,
                            location: true,
                        },
                    },
                },
            }),
            prisma.milestone.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        const milestone = await prisma.milestone.findUnique({
            where: { id },
            include: {
                site: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
            },
        });
        if (!milestone) {
            throw new Error('Milestone not found');
        }
        return milestone;
    }
    async update(id, data) {
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.targetDate !== undefined)
            updateData.targetDate = new Date(data.targetDate);
        if (data.percentComplete !== undefined) {
            updateData.percentComplete = data.percentComplete;
            // Auto-set completed date when reaching 100%
            if (data.percentComplete >= 100 && !data.completedDate) {
                updateData.completedDate = new Date();
            }
        }
        if (data.completedDate !== undefined) {
            updateData.completedDate = data.completedDate ? new Date(data.completedDate) : null;
        }
        return prisma.milestone.update({
            where: { id },
            data: updateData,
            include: {
                site: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        return prisma.milestone.delete({
            where: { id },
        });
    }
    async updateProgress(id, percentComplete) {
        const updateData = { percentComplete };
        // Auto-set completed date when reaching 100%
        if (percentComplete >= 100) {
            const milestone = await prisma.milestone.findUnique({ where: { id } });
            if (milestone && !milestone.completedDate) {
                updateData.completedDate = new Date();
            }
        }
        return prisma.milestone.update({
            where: { id },
            data: updateData,
            include: {
                site: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
            },
        });
    }
}
exports.MilestoneService = MilestoneService;
//# sourceMappingURL=milestone.service.js.map