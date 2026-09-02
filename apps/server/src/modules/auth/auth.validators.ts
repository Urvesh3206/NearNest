import { z } from 'zod';
import { UserRole } from '@neighbourhub/shared';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.nativeEnum(UserRole).default(UserRole.RESIDENT),
    phone: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    token: z.string(), // Firebase ID Token
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});
