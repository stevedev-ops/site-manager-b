"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const organization_routes_1 = __importDefault(require("./organization.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const site_routes_1 = __importDefault(require("./site.routes"));
const resource_routes_1 = __importDefault(require("./resource.routes"));
const attendance_routes_1 = __importDefault(require("./attendance.routes"));
const report_routes_1 = __importDefault(require("./report.routes"));
const task_routes_1 = __importDefault(require("./task.routes"));
const document_routes_1 = __importDefault(require("./document.routes"));
const router = (0, express_1.Router)();
// Mount routes
router.use('/auth', auth_routes_1.default);
router.use('/organizations', organization_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/sites', site_routes_1.default);
router.use('/resources', resource_routes_1.default);
router.use('/attendance', attendance_routes_1.default);
router.use('/reports', report_routes_1.default);
router.use('/tasks', task_routes_1.default);
router.use('/documents', document_routes_1.default);
// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.default = router;
//# sourceMappingURL=index.js.map