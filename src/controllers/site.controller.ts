import { Request, Response } from 'express';
import { SiteService } from '../services/site.service';
import { UserRole } from '../types';

const siteService = new SiteService();

export class SiteController {
    async create(req: Request, res: Response) {
        try {
            // Ensure organizationId is set correctly
            if (req.user?.role !== UserRole.SUPER_ADMIN) {
                req.body.organizationId = req.user?.organizationId;
            }

            const site = await siteService.create(req.body);
            res.status(201).json({ success: true, data: site });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const organizationId = req.user?.role === UserRole.SUPER_ADMIN
                ? req.query.organizationId as string
                : req.user?.organizationId;

            const result = await siteService.findAll({
                page,
                limit,
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
            const site = await siteService.findById(req.params.id);

            // Check permission
            if (req.user?.role !== UserRole.SUPER_ADMIN &&
                site.organizationId !== req.user?.organizationId) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }

            res.json({ success: true, data: site });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            // Check permission
            const siteToUpdate = await siteService.findById(req.params.id);

            const isSubAdmin = req.user?.role === UserRole.SUB_ADMIN;
            const isAssigned = siteToUpdate.siteUsers.some(su => su.userId === req.user?.id);

            if (req.user?.role !== UserRole.SUPER_ADMIN &&
                siteToUpdate.organizationId !== req.user?.organizationId &&
                !(isSubAdmin && isAssigned)) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }

            const site = await siteService.update(req.params.id, req.body);
            res.json({ success: true, data: site });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            // Check permission
            const siteToDelete = await siteService.findById(req.params.id);

            const isSubAdmin = req.user?.role === UserRole.SUB_ADMIN;
            const isAssigned = siteToDelete.siteUsers.some(su => su.userId === req.user?.id);

            if (req.user?.role !== UserRole.SUPER_ADMIN &&
                siteToDelete.organizationId !== req.user?.organizationId &&
                !(isSubAdmin && isAssigned)) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }

            await siteService.delete(req.params.id);
            res.json({ success: true, message: 'Site deleted' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async assignUser(req: Request, res: Response) {
        try {
            const { userId, role } = req.body;
            const assignment = await siteService.assignUser(req.params.id, userId, role);
            res.json({ success: true, data: assignment });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async removeUser(req: Request, res: Response) {
        try {
            await siteService.removeUser(req.params.id, req.params.userId);
            res.json({ success: true, message: 'User removed from site' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
