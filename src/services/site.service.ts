import prisma from '../config/database';
import { PaginationParams, PaginatedResponse, UserRole } from '../types';

export class SiteService {
    async create(data: any) {
        const site = await prisma.site.create({
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

    async findAll(
        params: PaginationParams & { organizationId?: string; userId?: string; role?: UserRole }
    ): Promise<PaginatedResponse<any>> {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (params.organizationId) where.organizationId = params.organizationId;

        // If user is not admin/super admin, only show assigned sites
        if (params.userId && params.role !== UserRole.SUPER_ADMIN && params.role !== UserRole.ADMIN) {
            where.siteUsers = {
                some: {
                    userId: params.userId,
                },
            };
        }

        const [sites, total] = await Promise.all([
            prisma.site.findMany({
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
            prisma.site.count({ where }),
        ]);

        return {
            data: sites,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string) {
        const site = await prisma.site.findUnique({
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

    async update(id: string, data: any) {
        const site = await prisma.site.update({
            where: { id },
            data,
        });

        return site;
    }

    async delete(id: string) {
        await prisma.site.delete({
            where: { id },
        });
        return { message: 'Site deleted successfully' };
    }

    async assignUser(siteId: string, userId: string, role: any) {
        // Check if user is already assigned
        const existingAssignment = await prisma.siteUser.findFirst({
            where: { siteId, userId },
        });

        if (existingAssignment) {
            throw new Error('User already assigned to this site');
        }

        const assignment = await prisma.siteUser.create({
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

    async removeUser(siteId: string, userId: string) {
        await prisma.siteUser.deleteMany({
            where: { siteId, userId },
        });
        return { message: 'User removed from site' };
    }
}
