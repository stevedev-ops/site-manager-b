"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const database_1 = __importDefault(require("../config/database"));
class DocumentService {
    async create(data) {
        // In a real app, we would encrypt the file here or handle the encrypted URL
        // For now, we assume the file is uploaded via middleware and we get the path/url
        const document = await database_1.default.document.create({
            data: {
                ...data,
            },
            include: {
                site: { select: { name: true } },
                uploader: { select: { name: true } },
            },
        });
        return document;
    }
    async findAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.siteId)
            where.siteId = params.siteId;
        if (params.type)
            where.type = params.type;
        // Filter by organization
        if (params.organizationId) {
            where.site = {
                organizationId: params.organizationId
            };
        }
        const [documents, total] = await Promise.all([
            database_1.default.document.findMany({
                where,
                skip,
                take: limit,
                include: {
                    site: { select: { name: true } },
                    uploader: { select: { name: true } },
                },
                orderBy: { uploadedAt: 'desc' },
            }),
            database_1.default.document.count({ where }),
        ]);
        return {
            data: documents,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        const document = await database_1.default.document.findUnique({
            where: { id },
            include: {
                site: { select: { name: true } },
                uploader: { select: { name: true } },
            },
        });
        if (!document) {
            throw new Error('Document not found');
        }
        return document;
    }
    async delete(id) {
        // In a real app, we would also delete the file from storage
        await database_1.default.document.delete({
            where: { id },
        });
        return { message: 'Document deleted successfully' };
    }
}
exports.DocumentService = DocumentService;
//# sourceMappingURL=document.service.js.map