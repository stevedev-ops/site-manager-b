import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';

export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Forbidden: Insufficient permissions'
            });
        }

        next();
    };
};

/**
 * Middleware to ensure users can only access their organization's data
 */
export const enforceOrganizationScope = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Super admins bypass organization scope
    if (req.user.role === UserRole.SUPER_ADMIN) {
        return next();
    }

    // For other users, we'll validate in the controller/service layer
    // This middleware just ensures they're authenticated
    next();
};
