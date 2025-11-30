import prisma from '../config/database';
import { PaginationParams, PaginatedResponse } from '../types';

export class TaskService {
    async create(data: any) {
        const task = await prisma.task.create({
            data: {
                ...data,
                status: 'PENDING',
            },
            include: {
                site: { select: { name: true } },
                assignee: { select: { name: true, email: true } },
            },
        });

        return task;
    }

    async findAll(
        params: PaginationParams & {
            siteId?: string;
            assignedTo?: string;
            status?: string;
            priority?: string;
            organizationId?: string;
        }
    ): Promise<PaginatedResponse<any>> {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (params.siteId) where.siteId = params.siteId;
        if (params.assignedTo) where.assignedTo = params.assignedTo;
        if (params.status) where.status = params.status;
        if (params.priority) where.priority = params.priority;

        // Filter by organization
        if (params.organizationId) {
            where.site = {
                organizationId: params.organizationId
            };
        }

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take: limit,
                include: {
                    site: { select: { name: true } },
                    assignee: { select: { name: true } },
                },
                orderBy: [
                    { priority: 'desc' },
                    { dueDate: 'asc' },
                ],
            }),
            prisma.task.count({ where }),
        ]);

        return {
            data: tasks,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string) {
        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                site: { select: { name: true } },
                assignee: { select: { name: true, email: true } },
            },
        });

        if (!task) {
            throw new Error('Task not found');
        }

        return task;
    }

    async update(id: string, data: any) {
        const task = await prisma.task.update({
            where: { id },
            data,
            include: {
                site: { select: { name: true } },
                assignee: { select: { name: true } },
            },
        });

        return task;
    }

    async delete(id: string) {
        await prisma.task.delete({
            where: { id },
        });
        return { message: 'Task deleted successfully' };
    }

    async updateStatus(id: string, status: any) {
        const task = await prisma.task.update({
            where: { id },
            data: { status },
        });

        return task;
    }
}
