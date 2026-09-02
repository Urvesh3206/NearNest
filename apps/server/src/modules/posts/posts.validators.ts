import { z } from 'zod';
import { PostType } from '@neighbourhub/shared';

export const createPostSchema = z.object({
  body: z.object({
    type: z.nativeEnum(PostType),
    title: z.string().optional(),
    content: z.string().min(1),
    media: z.array(z.string()).optional(),
    societyId: z.string().optional(),
    isPublic: z.boolean().optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    media: z.array(z.string()).optional(),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    parentId: z.string().optional(),
  }),
});
