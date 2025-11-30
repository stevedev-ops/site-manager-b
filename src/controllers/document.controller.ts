import { Request, Response } from 'express';
import { DocumentService } from '../services/document.service';
import { UserRole } from '../types';

const documentService = new DocumentService();

export class DocumentController {
    async create(req: Request, res: Response) {
        try {
            // Assuming file upload middleware puts file info in req.file
            // and other data in req.body
            const { siteId, type, fileName } = req.body;

            // If file was uploaded, use its path/url
            // For this implementation, we'll assume the client sends the URL or it's handled by upload middleware
            // Let's assume req.file contains the upload info if using multer
            const fileUrl = req.file ? req.file.path : req.body.encryptedUrl;

            const document = await documentService.create({
                siteId,
                type,
                fileName: fileName || (req.file ? req.file.originalname : 'Untitled'),
                encryptedUrl: fileUrl,
                uploadedBy: req.user!.id,
            });
            res.status(201).json({ success: true, data: document });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const siteId = req.query.siteId as string;
            const type = req.query.type as string;

            const organizationId = req.user?.role === UserRole.SUPER_ADMIN
                ? req.query.organizationId as string
                : req.user?.organizationId;

            const result = await documentService.findAll({
                page,
                limit,
                siteId,
                type,
                organizationId
            });
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const document = await documentService.findById(req.params.id);
            res.json({ success: true, data: document });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await documentService.delete(req.params.id);
            res.json({ success: true, message: 'Document deleted' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
