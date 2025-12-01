"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const log_controller_1 = require("../controllers/log.controller");
const router = (0, express_1.Router)();
// Allow clients to POST logs
router.post('/', log_controller_1.createLog);
exports.default = router;
//# sourceMappingURL=log.routes.js.map