"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLog = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const createLog = (req, res) => {
    const { level = 'info', message, meta } = req.body || {};
    if (!message) {
        return res.status(400).json({ error: 'message is required' });
    }
    // Avoid blocking; log and return
    logger_1.default.log({ level, message, meta });
    return res.status(201).json({ status: 'ok' });
};
exports.createLog = createLog;
exports.default = { createLog: exports.createLog };
//# sourceMappingURL=log.controller.js.map