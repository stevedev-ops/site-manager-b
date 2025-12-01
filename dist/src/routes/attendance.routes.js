"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendance_controller_1 = require("../controllers/attendance.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const controller = new attendance_controller_1.AttendanceController();
router.use(auth_1.authenticate);
// Clock In
router.post('/clock-in', controller.clockIn);
// Clock Out
router.post('/clock-out', controller.clockOut);
// Get Current Status
router.get('/status', controller.getCurrentStatus);
// List Attendance (Admin, Super Admin)
router.get('/', (0, rbac_1.authorize)(types_1.UserRole.SUPER_ADMIN, types_1.UserRole.ADMIN, types_1.UserRole.SUB_ADMIN), controller.findAll);
exports.default = router;
//# sourceMappingURL=attendance.routes.js.map