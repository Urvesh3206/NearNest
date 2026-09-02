import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import * as postsService from './posts.service';

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await postsService.createPost(req.user.id, req.body);
  res.status(201).json({ success: true, data: post });
});

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const { cursor, limit, type, societyId } = req.query;
  const filters: any = { isPublic: true };
  if (type) filters.type = type;
  if (societyId) filters.societyId = societyId;

  const result = await postsService.getPosts(filters, cursor as string, Number(limit) || 10);
  res.status(200).json({ success: true, data: result });
});

export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await postsService.getPostById(req.params.id);
  res.status(200).json({ success: true, data: post });
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await postsService.updatePost(req.params.id, req.user.id, req.body);
  res.status(200).json({ success: true, data: post });
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  await postsService.deletePost(req.params.id, req.user.id);
  res.status(200).json({ success: true, message: 'Post deleted successfully' });
});
