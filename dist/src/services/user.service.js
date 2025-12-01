"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
class UserService {
    async create(data) {
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        const user = await database_1.default.user.create({
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
    async findAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.role)
            where.role = params.role;
        if (params.organizationId)
            where.organizationId = params.organizationId;
        const [users, total] = await Promise.all([
            database_1.default.user.findMany({
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
            database_1.default.user.count({ where }),
        ]);
        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        const user = await database_1.default.user.findUnique({
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
    async update(id, data) {
        if (data.password) {
            data.password = await (0, password_1.hashPassword)(data.password);
        }
        const user = await database_1.default.user.update({
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
    async delete(id) {
        await database_1.default.user.delete({
            where: { id },
        });
        return { message: 'User deleted successfully' };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map