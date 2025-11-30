import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserRole } from '../types';

const userService = new UserService();

export class UserController {
    async create(req: Request, res: Response) {
        try {
            // If not Super Admin, force organizationId to be the creator's organization
            if (req.user?.role !== UserRole.SUPER_ADMIN) {
                req.body.organizationId = req.user?.organizationId;
            }

            const user = await userService.create(req.body);
            res.status(201).json({ success: true, data: user });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const role = req.query.role as UserRole;

            // If not Super Admin, filter by organization
            const organizationId = req.user?.role === UserRole.SUPER_ADMIN
                ? req.query.organizationId as string
                : req.user?.organizationId;

            const result = await userService.findAll({ page, limit, role, organizationId });
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const user = await userService.findById(req.params.id);

            // Check permission to view this user
            if (req.user?.role !== UserRole.SUPER_ADMIN &&
                user.organizationId !== req.user?.organizationId) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }

            res.json({ success: true, data: user });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            // Check permission
            const userToUpdate = await userService.findById(req.params.id);
            if (req.user?.role !== UserRole.SUPER_ADMIN &&
                userToUpdate.organizationId !== req.user?.organizationId) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }

            const user = await userService.update(req.params.id, req.body);
            res.json({ success: true, data: user });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            // Check permission
            const userToDelete = await userService.findById(req.params.id);
            if (req.user?.role !== UserRole.SUPER_ADMIN &&
                userToDelete.organizationId !== req.user?.organizationId) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }

            await userService.delete(req.params.id);
            res.json({ success: true, message: 'User deleted' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
