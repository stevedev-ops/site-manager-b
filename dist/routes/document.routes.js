"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_controller_1 = require("../controllers/document.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const upload_1 = require("../middleware/upload");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const controller = new document_controller_1.DocumentController();
router.use(auth_1.authenticate);
// List documents
router.get('/', controller.findAll);
// Upload document (Admin, Supervisor)
router.post('/', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUPERVISOR), upload_1.upload.single('file'), controller.create);
// Get document details
router.get('/:id', controller.findById);
// Delete document
router.delete('/:id', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN), controller.delete);
exports.default = router;
//# sourceMappingURL=document.routes.js.map