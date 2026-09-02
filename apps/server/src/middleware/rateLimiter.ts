import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '../config/redis';
import { Request, Response, NextFunction } from 'express';

const rateLimiterOptions = {
  storeClient: redis,
  keyPrefix: 'rateLimiter',
  points: 100, // 100 requests
  duration: 15 * 60, // per 15 minutes
};

const generalRateLimiter = new RateLimiterRedis(rateLimiterOptions);

const authRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'authLimiter',
  points: 10,
  duration: 15 * 60,
});

const apiRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'apiLimiter',
  points: 60,
  duration: 60,
});

export const generalLimiter = (req: Request, res: Response, next: NextFunction) => {
  generalRateLimiter.consume(req.ip as string)
    .then(() => next())
    .catch(() => res.status(429).send('Too Many Requests'));
};

export const authLimiter = (req: Request, res: Response, next: NextFunction) => {
  authRateLimiter.consume(req.ip as string)
    .then(() => next())
    .catch(() => res.status(429).send('Too Many Requests'));
};

export const apiLimiter = (req: Request, res: Response, next: NextFunction) => {
  apiRateLimiter.consume(req.ip as string)
    .then(() => next())
    .catch(() => res.status(429).send('Too Many Requests'));
};
