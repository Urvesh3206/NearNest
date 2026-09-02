import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.string().default('development'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().default('postgresql://user:password@localhost:5432/neighbourhub?schema=public'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().default('dev-jwt-secret-key-123456789'),
  JWT_REFRESH_SECRET: z.string().default('dev-jwt-refresh-secret-key-987654321'),
});

export const env = envSchema.parse(process.env);
