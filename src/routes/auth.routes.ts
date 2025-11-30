import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();
const authController = new AuthController();

// Public routes with rate limiting
router.post('/register', authRateLimiter, (req, res) =>
    authController.register(req, res)
);
router.post('/login', authRateLimiter, (req, res) =>
    authController.login(req, res)
);

// Protected routes
router.get('/profile', authenticate, (req, res) =>
    authController.getProfile(req, res)
);
router.put('/change-password', authenticate, (req, res) =>
    authController.changePassword(req, res)
);

export default router;
