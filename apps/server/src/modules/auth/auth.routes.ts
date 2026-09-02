import { Router } from 'express';
import { validate } from '../../middleware/validator';
import { registerSchema, loginSchema } from './auth.validators';
import * as authController from './auth.controller';
import { verifyToken } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.getMe);

export default router;
