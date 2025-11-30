"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const controller = new task_controller_1.TaskController();
router.use(auth_1.authenticate);
// List tasks
router.get('/', controller.findAll);
// Create task (Admin, Supervisor)
router.post('/', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUPERVISOR), controller.create);
// Get task details
router.get('/:id', controller.findById);
// Update task
router.put('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUPERVISOR), controller.update);
// Delete task
router.delete('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.delete);
// Update status (Assignee can also update status)
router.put('/:id/status', controller.updateStatus);
exports.default = router;
//# sourceMappingURL=task.routes.js.map