import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import * as usersService from './users.service';

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUserId = req.user?.id;
  const user = await usersService.getUserById(id, currentUserId);
  res.status(200).json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await usersService.updateProfile(req.user.id, req.body);
  res.status(200).json({ success: true, data: profile });
});

export const updatePrivacy = asyncHandler(async (req: Request, res: Response) => {
  const settings = await usersService.updatePrivacy(req.user.id, req.body);
  res.status(200).json({ success: true, data: settings });
});
