"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const types_1 = require("../types");
const userService = new user_service_1.UserService();
class UserController {
    async create(req, res) {
        try {
            // If not Super Admin, force organizationId to be the creator's organization
            if (req.user?.role !== types_1.UserRole.SUPER_ADMIN) {
                req.body.organizationId = req.user?.organizationId;
            }
            const user = await userService.create(req.body);
            res.status(201).json({ success: true, data: user });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const role = req.query.role;
            // If not Super Admin, filter by organization
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const result = await userService.findAll({ page, limit, role, organizationId });
            res.json({ success: true, ...result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async findById(req, res) {
        try {
            const user = await userService.findById(req.params.id);
            // Check permission to view this user
            if (req.user?.role !== types_1.UserRole.SUPER_ADMIN &&
                user.organizationId !== req.user?.organizationId) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }
            res.json({ success: true, data: user });
        }
        catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    async update(req, res) {
        try {
            // Check permission
            const userToUpdate = await userService.findById(req.params.id);
            if (req.user?.role !== types_1.UserRole.SUPER_ADMIN &&
                userToUpdate.organizationId !== req.user?.organizationId) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }
            const user = await userService.update(req.params.id, req.body);
            res.json({ success: true, data: user });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async delete(req, res) {
        try {
            // Check permission
            const userToDelete = await userService.findById(req.params.id);
            if (req.user?.role !== types_1.UserRole.SUPER_ADMIN &&
                userToDelete.organizationId !== req.user?.organizationId) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }
            await userService.delete(req.params.id);
            res.json({ success: true, message: 'User deleted' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map