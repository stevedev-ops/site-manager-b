import { PaginationParams, PaginatedResponse } from '../types';
export declare class AttendanceService {
    clockIn(userId: string, siteId: string, gpsLocation: {
        lat: number;
        lng: number;
    }, selfieUrl?: string): Promise<{
        user: {
            name: string;
        };
        site: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        siteId: string;
        userId: string;
        clockIn: Date;
        clockOut: Date | null;
        gpsLocation: import("@prisma/client/runtime/library").JsonValue | null;
        selfieUrl: string | null;
        verified: boolean;
        hoursWorked: number | null;
    }>;
    clockOut(userId: string, attendanceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        siteId: string;
        userId: string;
        clockIn: Date;
        clockOut: Date | null;
        gpsLocation: import("@prisma/client/runtime/library").JsonValue | null;
        selfieUrl: string | null;
        verified: boolean;
        hoursWorked: number | null;
    }>;
    findAll(params: PaginationParams & {
        siteId?: string;
        userId?: string;
        startDate?: Date;
        endDate?: Date;
        organizationId?: string;
    }): Promise<PaginatedResponse<any>>;
    getCurrentStatus(userId: string): Promise<({
        site: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        siteId: string;
        userId: string;
        clockIn: Date;
        clockOut: Date | null;
        gpsLocation: import("@prisma/client/runtime/library").JsonValue | null;
        selfieUrl: string | null;
        verified: boolean;
        hoursWorked: number | null;
    }) | null>;
}
//# sourceMappingURL=attendance.service.d.ts.map