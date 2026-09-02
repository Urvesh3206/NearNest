import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { firebaseAdmin } from '../config/firebase';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { AppError, asyncHandler } from './errorHandler';

export const generateJWT = (userId: string) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid }
    });
    
    if (!user) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Invalid token or token expired.', 401));
  }
});

export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      const user = await prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid }
      });
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Ignored for optional auth
    }
  }
  next();
});
