"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resource_controller_1 = require("../controllers/resource.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const controller = new resource_controller_1.ResourceController();
router.use(auth_1.authenticate);
// --- Resource Templates ---
// List templates
router.get('/templates', controller.findAllTemplates);
// Create template (Admin only)
router.post('/templates', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.createTemplate);
// Update template
router.put('/templates/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.updateTemplate);
// Delete template
router.delete('/templates/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.deleteTemplate);
// --- Site Resources ---
// Get site resources
router.get('/sites/:siteId', controller.getSiteResources);
// Update site resource (Admin, Supervisor)
router.post('/sites/:siteId', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUPERVISOR), controller.updateSiteResource);
exports.default = router;
//# sourceMappingURL=resource.routes.js.map