import { Router } from 'express';
import { validate } from '../../middleware/validator';
import { createPostSchema, updatePostSchema } from './posts.validators';
import * as postsController from './posts.controller';
import { verifyToken, optionalAuth } from '../../middleware/auth';

const router = Router();

router.get('/', optionalAuth, postsController.getPosts);
router.get('/:id', optionalAuth, postsController.getPost);

router.post('/', verifyToken, validate(createPostSchema), postsController.createPost);
router.patch('/:id', verifyToken, validate(updatePostSchema), postsController.updatePost);
router.delete('/:id', verifyToken, postsController.deletePost);

export default router;
