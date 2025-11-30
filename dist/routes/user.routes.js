"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const controller = new user_controller_1.UserController();
router.use(auth_1.authenticate);
// List users (Super Admin sees all, Admin sees org users)
router.get('/', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.findAll);
// Get specific user
router.get('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.findById);
// Create user
router.post('/', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.create);
// Update user
router.put('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.update);
// Delete user
router.delete('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.delete);
exports.default = router;
//# sourceMappingURL=user.routes.js.map