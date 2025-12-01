import { JWTPayload } from '../types';
export declare const generateToken: (payload: JWTPayload) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => {
    id: string;
};
//# sourceMappingURL=jwt.d.ts.map