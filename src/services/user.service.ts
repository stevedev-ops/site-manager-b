import prisma from '../config/database';
import { hashPassword } from '../utils/password';
import { UserRole, PaginationParams, PaginatedResponse } from '../types';

export class UserService {
    async create(data: any) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await hashPassword(data.password);

        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                organizationId: true,
                phone: true,
                isActive: true,
                createdAt: true,
            },
        });

        return user;
    }

    async findAll(params: PaginationParams & { role?: UserRole; organizationId?: string }): Promise<PaginatedResponse<any>> {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (params.role) where.role = params.role;
        if (params.organizationId) where.organizationId = params.organizationId;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    organizationId: true,
                    phone: true,
                    isActive: true,
                    createdAt: true,
                    organization: {
                        select: { name: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                organizationId: true,
                phone: true,
                isActive: true,
                createdAt: true,
                organization: {
                    select: { name: true },
                },
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async update(id: string, data: any) {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }

        const user = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                organizationId: true,
                phone: true,
                isActive: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async delete(id: string) {
        await prisma.user.delete({
            where: { id },
        });
        return { message: 'User deleted successfully' };
    }
}
