import { Router } from 'express';
import { verifyToken } from '../../middleware/auth';
import * as uploadController from './upload.controller';

const router = Router();

router.post('/presigned-url', verifyToken, uploadController.generatePresignedUrl);

export default router;
