import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { UserRole } from '../types';

export class AuthService {
    async register(data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        role: UserRole;
        organizationId?: string;
    }) {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create user
        const user = await prisma.user.create({
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
        const token = generateToken({
            id: user.id,
            role: user.role,
            organizationId: user.organizationId || undefined,
        });

        const refreshToken = generateRefreshToken(user.id);

        return { user, token, refreshToken };
    }

    async login(email: string, password: string) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
            throw new Error('User account is deactivated');
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Generate tokens
        const token = generateToken({
            id: user.id,
            role: user.role,
            organizationId: user.organizationId || undefined,
        });

        const refreshToken = generateRefreshToken(user.id);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token, refreshToken };
    }

    async refreshToken(refreshToken: string) {
        // This will be implemented with refresh token validation
        // For now, just a placeholder
        throw new Error('Not implemented');
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await comparePassword(oldPassword, user.password);

        if (!isValidPassword) {
            throw new Error('Invalid current password');
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return { message: 'Password changed successfully' };
    }
}
