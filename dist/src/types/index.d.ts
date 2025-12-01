import { UserRole } from '@prisma/client';
export { UserRole };
export interface JWTPayload {
    id: string;
    role: UserRole;
    organizationId?: string;
}
export interface GPSLocation {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
//# sourceMappingURL=index.d.ts.map