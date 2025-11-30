import prisma from '../config/database';
import { PaginationParams, PaginatedResponse, UserRole } from '../types';

export class ReportService {
    async create(data: any) {
        const report = await prisma.report.create({
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

    async findAll(
        params: PaginationParams & {
            siteId?: string;
            supervisorId?: string;
            status?: string;
            organizationId?: string;
            userId?: string;
            role?: UserRole;
        }
    ): Promise<PaginatedResponse<any>> {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (params.siteId) where.siteId = params.siteId;
        if (params.supervisorId) where.supervisorId = params.supervisorId;
        if (params.status) where.status = params.status;

        // Filter by organization
        if (params.organizationId) {
            where.supervisor = {
                organizationId: params.organizationId
            };
        }

        // If client or sub admin, only show reports for assigned sites
        if ((params.role === UserRole.CLIENT || params.role === UserRole.SUB_ADMIN) && params.userId) {
            where.site = {
                siteUsers: {
                    some: {
                        userId: params.userId
                    }
                }
            };
        }

        const [reports, total] = await Promise.all([
            prisma.report.findMany({
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
            prisma.report.count({ where }),
        ]);

        return {
            data: reports,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string) {
        const report = await prisma.report.findUnique({
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

    async updateStatus(id: string, status: 'APPROVED' | 'REJECTED', userId: string) {
        const report = await prisma.report.update({
            where: { id },
            data: {
                status,
                approvedBy: status === 'APPROVED' ? userId : null,
                approvedAt: status === 'APPROVED' ? new Date() : null,
            },
        });

        return report;
    }

    async addComment(reportId: string, userId: string, content: string) {
        const comment = await prisma.comment.create({
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

    async addPhoto(reportId: string, url: string, caption?: string) {
        const photo = await prisma.reportPhoto.create({
            data: {
                reportId,
                url,
                caption,
            },
        });

        return photo;
    }
}
