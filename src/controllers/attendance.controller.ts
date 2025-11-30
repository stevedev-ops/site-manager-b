import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { UserRole } from '../types';

const attendanceService = new AttendanceService();

export class AttendanceController {
    async clockIn(req: Request, res: Response) {
        try {
            const { siteId, gpsLocation, selfieUrl } = req.body;
            const attendance = await attendanceService.clockIn(
                req.user!.id,
                siteId,
                gpsLocation,
                selfieUrl
            );
            res.status(201).json({ success: true, data: attendance });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async clockOut(req: Request, res: Response) {
        try {
            const { attendanceId } = req.body;
            const attendance = await attendanceService.clockOut(
                req.user!.id,
                attendanceId
            );
            res.json({ success: true, data: attendance });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const siteId = req.query.siteId as string;
            const userId = req.query.userId as string;

            const organizationId = req.user?.role === UserRole.SUPER_ADMIN
                ? req.query.organizationId as string
                : req.user?.organizationId;

            const result = await attendanceService.findAll({
                page,
                limit,
                siteId,
                userId,
                organizationId
            });
            res.json({ success: true, ...result });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getCurrentStatus(req: Request, res: Response) {
        try {
            const status = await attendanceService.getCurrentStatus(req.user!.id);
            res.json({ success: true, data: status });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
