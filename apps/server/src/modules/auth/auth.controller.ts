import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import * as authService from './auth.service';
import { generateJWT, generateRefreshToken } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { firebaseAdmin } from '../../config/firebase';
import { AppError } from '../../middleware/errorHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  const decoded = await firebaseAdmin.auth().verifyIdToken(token);
  
  const user = await authService.loginUser(decoded.uid, req.ip, req.headers['user-agent']);
  
  const accessToken = generateJWT(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // create session
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  });

  res.status(200).json({
    success: true,
    data: {
      user,
      accessToken,
      refreshToken,
      sessionId: session.id
    }
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.body; // Assuming client sends current sessionId
  if (sessionId) {
    await authService.logoutSession(sessionId);
  }
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError('Not authenticated', 401);
  
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { profile: true, privacySettings: true }
  });
  
  res.status(200).json({ success: true, data: user });
});
