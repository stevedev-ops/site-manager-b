import prisma from '../config/database';
import { PaginationParams, PaginatedResponse } from '../types';

export class OrganizationService {
    async create(data: { name: string; plan?: string }) {
        const organization = await prisma.organization.create({
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

    async findAll(params: PaginationParams): Promise<PaginatedResponse<any>> {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const [organizations, total] = await Promise.all([
            prisma.organization.findMany({
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
            prisma.organization.count(),
        ]);

        return {
            data: organizations,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string) {
        const organization = await prisma.organization.findUnique({
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

    async update(id: string, data: { name?: string; plan?: string; isActive?: boolean }) {
        const organization = await prisma.organization.update({
            where: { id },
            data: {
                name: data.name,
                plan: data.plan,
                isActive: data.isActive,
            },
        });

        return organization;
    }

    async delete(id: string) {
        await prisma.organization.delete({
            where: { id },
        });
        return { message: 'Organization deleted successfully' };
    }

    async getStats(id: string) {
        const [usersCount, sitesCount, activeSitesCount] = await Promise.all([
            prisma.user.count({ where: { organizationId: id } }),
            prisma.site.count({ where: { organizationId: id } }),
            prisma.site.count({ where: { organizationId: id, status: 'ACTIVE' } }),
        ]);

        return {
            users: usersCount,
            sites: sitesCount,
            activeSites: activeSitesCount,
        };
    }
}
