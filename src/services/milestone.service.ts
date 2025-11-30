import { PrismaClient } from '@prisma/client';
import { PaginationParams, PaginatedResponse } from '../types';

const prisma = new PrismaClient();

interface MilestoneFilters extends PaginationParams {
    siteId?: string;
    organizationId?: string;
}

export class MilestoneService {
    async create(data: {
        siteId: string;
        title: string;
        description?: string;
        targetDate: Date | string;
        percentComplete?: number;
    }) {
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

    async findAll(filters: MilestoneFilters): Promise<PaginatedResponse<any>> {
        const { page = 1, limit = 10, siteId, organizationId } = filters;
        const skip = (page - 1) * limit;

        const where: any = {};

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

    async findById(id: string) {
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

    async update(id: string, data: {
        title?: string;
        description?: string;
        targetDate?: Date | string;
        percentComplete?: number;
        completedDate?: Date | string | null;
    }) {
        const updateData: any = {};

        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.targetDate !== undefined) updateData.targetDate = new Date(data.targetDate);
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

    async delete(id: string) {
        return prisma.milestone.delete({
            where: { id },
        });
    }

    async updateProgress(id: string, percentComplete: number) {
        const updateData: any = { percentComplete };

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
