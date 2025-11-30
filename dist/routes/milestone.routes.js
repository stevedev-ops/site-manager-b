"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const milestone_controller_1 = require("../controllers/milestone.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const controller = new milestone_controller_1.MilestoneController();
router.use(auth_1.authenticate);
// List milestones
router.get('/', controller.findAll);
// Get milestone by ID
router.get('/:id', controller.findById);
// Create milestone (Admin, Sub-Admin only)
router.post('/', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUB_ADMIN), controller.create);
// Update milestone
router.put('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUB_ADMIN), controller.update);
// Update progress
router.patch('/:id/progress', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUB_ADMIN, types_1.UserRole.SUPERVISOR), controller.updateProgress);
// Delete milestone
router.delete('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUB_ADMIN), controller.delete);
exports.default = router;
//# sourceMappingURL=milestone.routes.js.map