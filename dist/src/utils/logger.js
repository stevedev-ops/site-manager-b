"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const { combine, timestamp, printf, errors, splat, json } = winston_1.default.format;
const logDir = path_1.default.resolve(__dirname, '../../logs');
// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    const base = `${timestamp} [${level}]: ${message}`;
    if (stack)
        return `${base}\n${stack}`;
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${base}${metaStr}`;
});
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(errors({ stack: true }), timestamp(), splat(), json()),
    transports: [
        new winston_1.default.transports.Console({
            format: combine(timestamp(), logFormat),
        }),
        new winston_daily_rotate_file_1.default({
            dirname: logDir,
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            zippedArchive: true,
            level: 'info',
        }),
        new winston_daily_rotate_file_1.default({
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
exports.default = logger;
//# sourceMappingURL=logger.js.map