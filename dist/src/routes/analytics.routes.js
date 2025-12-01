"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const controller = new analytics_controller_1.AnalyticsController();
router.use(auth_1.authenticate);
router.use((0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUB_ADMIN));
// Get attendance statistics
router.get('/attendance', controller.getAttendanceStats);
// Get resource statistics
router.get('/resources', controller.getResourceStats);
// Get report statistics
router.get('/reports', controller.getReportStats);
// Get site statistics
router.get('/sites', controller.getSiteStats);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map