import { Router } from 'express';
import { validate } from '../../middleware/validator';
import { updateProfileSchema, updatePrivacySchema } from './users.validators';
import * as usersController from './users.controller';
import { verifyToken, optionalAuth } from '../../middleware/auth';

const router = Router();

router.get('/:id', optionalAuth, usersController.getUser);
router.patch('/profile', verifyToken, validate(updateProfileSchema), usersController.updateProfile);
router.patch('/privacy', verifyToken, validate(updatePrivacySchema), usersController.updatePrivacy);

export default router;
