import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, printf, errors, splat, json } = winston.format;

const logDir = path.resolve(__dirname, '../../logs');

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    const base = `${timestamp} [${level}]: ${message}`;
    if (stack) return `${base}\n${stack}`;
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${base}${metaStr}`;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp(),
        splat(),
        json()
    ),
    transports: [
        new winston.transports.Console({
            format: combine(timestamp(), logFormat),
        }),
        new DailyRotateFile({
            dirname: logDir,
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            zippedArchive: true,
            level: 'info',
        }),
        new DailyRotateFile({
            dirname: logDir,
            filename: 'errors-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            zippedArchive: true,
            level: 'error',
        }),
    ],
    exitOnError: false,
});

export default logger;
