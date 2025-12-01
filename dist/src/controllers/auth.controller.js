"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const { email, password, name, phone, role, organizationId } = req.body;
            // Validation
            if (!email || !password || !name || !role) {
                return res.status(400).json({
                    error: 'Missing required fields: email, password, name, role',
                });
            }
            const result = await authService.register({
                email,
                password,
                name,
                phone,
                role,
                organizationId,
            });
            return res.status(201).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required',
                });
            }
            const result = await authService.login(email, password);
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(401).json({
                error: error.message,
            });
        }
    }
    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    error: 'Old password and new password are required',
                });
            }
            const result = await authService.changePassword(userId, oldPassword, newPassword);
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
    async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            // Fetch user from database (without password)
            const prisma = require('../config/database').default;
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    organizationId: true,
                    faceImageUrl: true,
                    is2FAEnabled: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map