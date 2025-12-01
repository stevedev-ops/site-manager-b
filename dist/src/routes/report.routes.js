"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../controllers/report.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const controller = new report_controller_1.ReportController();
router.use(auth_1.authenticate);
// List reports
router.get('/', controller.findAll);
// Create report (Supervisor only)
router.post('/', (0, rbac_1.authorize)(types_1.UserRole.SUPERVISOR), controller.create);
// Get report details
router.get('/:id', controller.findById);
// Update report status (Admin only)
router.put('/:id/status', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUB_ADMIN), controller.updateStatus);
// Add comment
router.post('/:id/comments', controller.addComment);
// Add photo
router.post('/:id/photos', controller.addPhoto);
exports.default = router;
//# sourceMappingURL=report.routes.js.map