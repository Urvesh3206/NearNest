import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    interests: z.array(z.string()).optional(),
  }),
});

export const updatePrivacySchema = z.object({
  body: z.object({
    hidePhone: z.boolean().optional(),
    hideEmail: z.boolean().optional(),
    profileVisibility: z.enum(['PUBLIC', 'SOCIETY', 'PRIVATE']).optional(),
  }),
});
