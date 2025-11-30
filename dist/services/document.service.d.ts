import { PaginationParams, PaginatedResponse } from '../types';
export declare class DocumentService {
    create(data: any): Promise<{
        site: {
            name: string;
        };
        uploader: {
            name: string;
        };
    } & {
        id: string;
        siteId: string;
        uploadedAt: Date;
        type: import(".prisma/client").$Enums.DocumentType;
        fileName: string;
        encryptedUrl: string;
        uploadedBy: string;
    }>;
    findAll(params: PaginationParams & {
        siteId?: string;
        type?: string;
        organizationId?: string;
    }): Promise<PaginatedResponse<any>>;
    findById(id: string): Promise<{
        site: {
            name: string;
        };
        uploader: {
            name: string;
        };
    } & {
        id: string;
        siteId: string;
        uploadedAt: Date;
        type: import(".prisma/client").$Enums.DocumentType;
        fileName: string;
        encryptedUrl: string;
        uploadedBy: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=document.service.d.ts.map