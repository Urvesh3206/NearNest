import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../../middleware/errorHandler';
import * as uploadService from './upload.service';
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from '@neighbourhub/shared';

export const generatePresignedUrl = asyncHandler(async (req: Request, res: Response) => {
  const { contentType, folder } = req.body;
  
  if (!contentType) {
    throw new AppError('ContentType is required', 400);
  }

  const supportedTypes = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
  if (!supportedTypes.includes(contentType)) {
    throw new AppError('Unsupported file type', 400);
  }

  const result = await uploadService.getPresignedUrl(req.user.id, contentType, folder);
  res.status(200).json({ success: true, data: result });
});
