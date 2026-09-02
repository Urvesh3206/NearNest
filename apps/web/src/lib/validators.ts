import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['RESIDENT', 'BUSINESS', 'SERVICE_PROVIDER']).default('RESIDENT'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

export const privacySchema = z.object({
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showAddress: z.boolean(),
});

export const postSchema = z.object({
  type: z.enum(['DISCUSSION', 'EVENT', 'MARKETPLACE', 'RECOMMENDATION', 'ALERT']),
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(2000),
  media: z.array(z.string().url()).optional(),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  filters: z.record(z.string(), z.any()).optional(),
});
