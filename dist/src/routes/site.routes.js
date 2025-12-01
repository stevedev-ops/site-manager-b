"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const site_controller_1 = require("../controllers/site.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const controller = new site_controller_1.SiteController();
router.use(auth_1.authenticate);
// List sites (filtered by role/org)
router.get('/', controller.findAll);
// Get specific site
router.get('/:id', controller.findById);
// Create site (Super Admin, Admin)
router.post('/', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.create);
// Update site
router.put('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.update);
// Delete site
router.delete('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.delete);
// Assign user to site
router.post('/:id/users', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.assignUser);
// Remove user from site
router.delete('/:id/users/:userId', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.removeUser);
exports.default = router;
//# sourceMappingURL=site.routes.js.map