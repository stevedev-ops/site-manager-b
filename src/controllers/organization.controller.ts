import { Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service';

const organizationService = new OrganizationService();

export class OrganizationController {
    async create(req: Request, res: Response) {
        try {
            const { name, plan } = req.body;
            const organization = await organizationService.create({ name, plan });
            res.status(201).json({ success: true, data: organization });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await organizationService.findAll({ page, limit });
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const organization = await organizationService.findById(req.params.id);
            res.json({ success: true, data: organization });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const organization = await organizationService.update(req.params.id, req.body);
            res.json({ success: true, data: organization });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await organizationService.delete(req.params.id);
            res.json({ success: true, message: 'Organization deleted' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async getStats(req: Request, res: Response) {
        try {
            const stats = await organizationService.getStats(req.params.id);
            res.json({ success: true, data: stats });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
