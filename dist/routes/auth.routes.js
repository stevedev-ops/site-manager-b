"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Public routes with rate limiting
router.post('/register', rateLimiter_1.authRateLimiter, (req, res) => authController.register(req, res));
router.post('/login', rateLimiter_1.authRateLimiter, (req, res) => authController.login(req, res));
// Protected routes
router.get('/profile', auth_1.authenticate, (req, res) => authController.getProfile(req, res));
router.put('/change-password', auth_1.authenticate, (req, res) => authController.changePassword(req, res));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map