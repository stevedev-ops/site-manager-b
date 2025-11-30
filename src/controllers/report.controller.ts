import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { UserRole } from '../types';

const reportService = new ReportService();

export class ReportController {
    async create(req: Request, res: Response) {
        try {
            const report = await reportService.create({
                ...req.body,
                supervisorId: req.user!.id,
            });
            res.status(201).json({ success: true, data: report });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const siteId = req.query.siteId as string;
            const supervisorId = req.query.supervisorId as string;
            const status = req.query.status as string;

            const organizationId = req.user?.role === UserRole.SUPER_ADMIN
                ? req.query.organizationId as string
                : req.user?.organizationId;

            const result = await reportService.findAll({
                page,
                limit,
                siteId,
                supervisorId,
                status,
                organizationId,
                userId: req.user?.id,
                role: req.user?.role
            });
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const report = await reportService.findById(req.params.id);
            res.json({ success: true, data: report });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            const report = await reportService.updateStatus(req.params.id, status, req.user!.id);
            res.json({ success: true, data: report });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async addComment(req: Request, res: Response) {
        try {
            const { content } = req.body;
            const comment = await reportService.addComment(req.params.id, req.user!.id, content);
            res.json({ success: true, data: comment });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async addPhoto(req: Request, res: Response) {
        try {
            // Assuming file upload middleware has processed the file and put url in req.file.path or similar
            // For now, we'll expect url in body for simplicity or handle file upload separately
            const { url, caption } = req.body;
            const photo = await reportService.addPhoto(req.params.id, url, caption);
            res.json({ success: true, data: photo });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
