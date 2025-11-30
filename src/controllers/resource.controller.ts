import { Request, Response } from 'express';
import { ResourceService } from '../services/resource.service';
import { UserRole } from '../types';

const resourceService = new ResourceService();

export class ResourceController {
    // --- Templates ---

    async createTemplate(req: Request, res: Response) {
        try {
            if (req.user?.role !== UserRole.SUPER_ADMIN) {
                req.body.organizationId = req.user?.organizationId;
            }

            const template = await resourceService.createTemplate(req.body);
            res.status(201).json({ success: true, data: template });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async findAllTemplates(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const organizationId = req.user?.role === UserRole.SUPER_ADMIN
                ? req.query.organizationId as string
                : req.user?.organizationId;

            const result = await resourceService.findAllTemplates({ page, limit, organizationId });
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateTemplate(req: Request, res: Response) {
        try {
            const template = await resourceService.updateTemplate(req.params.id, req.body);
            res.json({ success: true, data: template });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async deleteTemplate(req: Request, res: Response) {
        try {
            await resourceService.deleteTemplate(req.params.id);
            res.json({ success: true, message: 'Template deleted' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // --- Site Resources ---

    async getSiteResources(req: Request, res: Response) {
        try {
            const resources = await resourceService.getSiteResources(req.params.siteId);
            res.json({ success: true, data: resources });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateSiteResource(req: Request, res: Response) {
        try {
            const { templateId, quantity } = req.body;
            const resource = await resourceService.updateSiteResource(
                req.params.siteId,
                templateId,
                quantity,
                req.user!.id
            );
            res.json({ success: true, data: resource });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
