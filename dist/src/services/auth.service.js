"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
class AuthService {
    async register(data) {
        // Check if user exists
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Hash password
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        // Create user
        const user = await database_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                phone: data.phone,
                role: data.role,
                organizationId: data.organizationId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                organizationId: true,
                createdAt: true,
            },
        });
        // Generate tokens
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            role: user.role,
            organizationId: user.organizationId || undefined,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        return { user, token, refreshToken };
    }
    async login(email, password) {
        // Find user
        const user = await database_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (!user.isActive) {
            throw new Error('User account is deactivated');
        }
        // Verify password
        const isValidPassword = await (0, password_1.comparePassword)(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        // Generate tokens
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            role: user.role,
            organizationId: user.organizationId || undefined,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token, refreshToken };
    }
    async refreshToken(refreshToken) {
        // This will be implemented with refresh token validation
        // For now, just a placeholder
        throw new Error('Not implemented');
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const isValidPassword = await (0, password_1.comparePassword)(oldPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid current password');
        }
        const hashedPassword = await (0, password_1.hashPassword)(newPassword);
        await database_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { message: 'Password changed successfully' };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map