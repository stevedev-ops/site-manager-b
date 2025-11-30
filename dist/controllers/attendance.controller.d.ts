import { Request, Response } from 'express';
export declare class AttendanceController {
    clockIn(req: Request, res: Response): Promise<void>;
    clockOut(req: Request, res: Response): Promise<void>;
    findAll(req: Request, res: Response): Promise<void>;
    getCurrentStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=attendance.controller.d.ts.map