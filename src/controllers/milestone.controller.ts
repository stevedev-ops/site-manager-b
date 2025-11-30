import { Request, Response } from 'express';
import { MilestoneService } from '../services/milestone.service';
import { UserRole } from '../types';

const milestoneService = new MilestoneService();

export class MilestoneController {
    async create(req: Request, res: Response) {
        try {
            const milestone = await milestoneService.create(req.body);
            res.status(201).json({ success: true, data: milestone });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const siteId = req.query.siteId as string;

            const organizationId = req.user?.role === UserRole.SUPER_ADMIN
                ? req.query.organizationId as string
                : req.user?.organizationId;

            const result = await milestoneService.findAll({
                page,
                limit,
                siteId,
                organizationId
            });
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const milestone = await milestoneService.findById(req.params.id);
            res.json({ success: true, data: milestone });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const milestone = await milestoneService.update(req.params.id, req.body);
            res.json({ success: true, data: milestone });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await milestoneService.delete(req.params.id);
            res.json({ success: true, message: 'Milestone deleted' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async updateProgress(req: Request, res: Response) {
        try {
            const { percentComplete } = req.body;
            const milestone = await milestoneService.updateProgress(req.params.id, percentComplete);
            res.json({ success: true, data: milestone });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
