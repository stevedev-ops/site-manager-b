"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const database_1 = __importDefault(require("../config/database"));
class TaskService {
    async create(data) {
        const task = await database_1.default.task.create({
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
    async findAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.siteId)
            where.siteId = params.siteId;
        if (params.assignedTo)
            where.assignedTo = params.assignedTo;
        if (params.status)
            where.status = params.status;
        if (params.priority)
            where.priority = params.priority;
        // Filter by organization
        if (params.organizationId) {
            where.site = {
                organizationId: params.organizationId
            };
        }
        const [tasks, total] = await Promise.all([
            database_1.default.task.findMany({
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
            database_1.default.task.count({ where }),
        ]);
        return {
            data: tasks,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        const task = await database_1.default.task.findUnique({
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
    async update(id, data) {
        const task = await database_1.default.task.update({
            where: { id },
            data,
            include: {
                site: { select: { name: true } },
                assignee: { select: { name: true } },
            },
        });
        return task;
    }
    async delete(id) {
        await database_1.default.task.delete({
            where: { id },
        });
        return { message: 'Task deleted successfully' };
    }
    async updateStatus(id, status) {
        const task = await database_1.default.task.update({
            where: { id },
            data: { status },
        });
        return task;
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map