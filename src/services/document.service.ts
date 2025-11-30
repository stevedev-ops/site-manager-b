import prisma from '../config/database';
import { PaginationParams, PaginatedResponse } from '../types';

export class DocumentService {
    async create(data: any) {
        // In a real app, we would encrypt the file here or handle the encrypted URL
        // For now, we assume the file is uploaded via middleware and we get the path/url
        const document = await prisma.document.create({
            data: {
                ...data,
            },
            include: {
                site: { select: { name: true } },
                uploader: { select: { name: true } },
            },
        });

        return document;
    }

    async findAll(
        params: PaginationParams & {
            siteId?: string;
            type?: string;
            organizationId?: string;
        }
    ): Promise<PaginatedResponse<any>> {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (params.siteId) where.siteId = params.siteId;
        if (params.type) where.type = params.type;

        // Filter by organization
        if (params.organizationId) {
            where.site = {
                organizationId: params.organizationId
            };
        }

        const [documents, total] = await Promise.all([
            prisma.document.findMany({
                where,
                skip,
                take: limit,
                include: {
                    site: { select: { name: true } },
                    uploader: { select: { name: true } },
                },
                orderBy: { uploadedAt: 'desc' },
            }),
            prisma.document.count({ where }),
        ]);

        return {
            data: documents,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string) {
        const document = await prisma.document.findUnique({
            where: { id },
            include: {
                site: { select: { name: true } },
                uploader: { select: { name: true } },
            },
        });

        if (!document) {
            throw new Error('Document not found');
        }

        return document;
    }

    async delete(id: string) {
        // In a real app, we would also delete the file from storage
        await prisma.document.delete({
            where: { id },
        });
        return { message: 'Document deleted successfully' };
    }
}
