"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    // Enrich log with request context
    const meta = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        body: req.body,
        params: req.params,
        query: req.query,
        user: req.user?.id || null,
    };
    logger_1.default.error(err.message || 'Unhandled error', { ...meta, stack: err.stack, err });
    // Prisma errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'Duplicate entry',
            message: 'A record with this data already exists',
        });
    }
    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Not found',
            message: 'The requested resource was not found',
        });
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
            message: 'The provided token is invalid',
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            message: 'The provided token has expired',
        });
    }
    // Validation errors
    if (err.name === 'ZodError') {
        return res.status(400).json({
            error: 'Validation error',
            message: err.errors,
        });
    }
    // Default error
    return res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map