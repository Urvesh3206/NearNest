import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from '../config/env';

export const securityMiddleware = [
  helmet(),
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
  hpp(), // Protect against HTTP Parameter Pollution attacks
  mongoSanitize(), // Protect against NoSQL injection
];
