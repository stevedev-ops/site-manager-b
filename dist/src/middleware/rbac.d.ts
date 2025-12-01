import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';
export declare const authorize: (...allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware to ensure users can only access their organization's data
 */
export declare const enforceOrganizationScope: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=rbac.d.ts.map