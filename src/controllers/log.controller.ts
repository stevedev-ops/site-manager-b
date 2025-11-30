import { Request, Response } from 'express';
import logger from '../utils/logger';

export const createLog = (req: Request, res: Response) => {
    const { level = 'info', message, meta } = req.body || {};

    if (!message) {
        return res.status(400).json({ error: 'message is required' });
    }

    // Avoid blocking; log and return
    logger.log({ level, message, meta });

    return res.status(201).json({ status: 'ok' });
};

export default { createLog };
