"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceOrganizationScope = exports.authorize = void 0;
const types_1 = require("../types");
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
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
exports.authorize = authorize;
/**
 * Middleware to ensure users can only access their organization's data
 */
const enforceOrganizationScope = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // Super admins bypass organization scope
    if (req.user.role === types_1.UserRole.SUPER_ADMIN) {
        return next();
    }
    // For other users, we'll validate in the controller/service layer
    // This middleware just ensures they're authenticated
    next();
};
exports.enforceOrganizationScope = enforceOrganizationScope;
//# sourceMappingURL=rbac.js.map