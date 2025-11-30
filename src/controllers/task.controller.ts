import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { UserRole } from '../types';

const taskService = new TaskService();

export class TaskController {
    async create(req: Request, res: Response) {
        try {
            const task = await taskService.create(req.body);
            res.status(201).json({ success: true, data: task });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const siteId = req.query.siteId as string;
            const assignedTo = req.query.assignedTo as string;
            const status = req.query.status as string;
            const priority = req.query.priority as string;

            const organizationId = req.user?.role === UserRole.SUPER_ADMIN
                ? req.query.organizationId as string
                : req.user?.organizationId;

            const result = await taskService.findAll({
                page,
                limit,
                siteId,
                assignedTo,
                status,
                priority,
                organizationId
            });
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const task = await taskService.findById(req.params.id);
            res.json({ success: true, data: task });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const task = await taskService.update(req.params.id, req.body);
            res.json({ success: true, data: task });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await taskService.delete(req.params.id);
            res.json({ success: true, message: 'Task deleted' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            const task = await taskService.updateStatus(req.params.id, status);
            res.json({ success: true, data: task });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
