import { UserRole } from '../types';
export declare class AuthService {
    register(data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        role: UserRole;
        organizationId?: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            organizationId: string | null;
            createdAt: Date;
        };
        token: string;
        refreshToken: string;
    }>;
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            faceImageUrl: string | null;
            is2FAEnabled: boolean;
            twoFASecret: string | null;
            isActive: boolean;
            organizationId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<void>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map