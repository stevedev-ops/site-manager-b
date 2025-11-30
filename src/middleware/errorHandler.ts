import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Enrich log with request context
    const meta = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        body: req.body,
        params: req.params,
        query: req.query,
        user: (req as any).user?.id || null,
    };

    logger.error(err.message || 'Unhandled error', { ...meta, stack: err.stack, err });
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
