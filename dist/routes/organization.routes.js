"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organization_controller_1 = require("../controllers/organization.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const controller = new organization_controller_1.OrganizationController();
// All routes require authentication
router.use(auth_1.authenticate);
// Only Super Admin can manage organizations
router.post('/', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN), controller.create);
router.get('/', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN), controller.findAll);
router.get('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN), controller.findById);
router.put('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN), controller.update);
router.delete('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN), controller.delete);
router.get('/:id/stats', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN), controller.getStats);
exports.default = router;
//# sourceMappingURL=organization.routes.js.map