import { Request, Response } from 'express';
export declare class SiteController {
    create(req: Request, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    assignUser(req: Request, res: Response): Promise<void>;
    removeUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=site.controller.d.ts.map