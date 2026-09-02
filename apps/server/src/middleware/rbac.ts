import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@neighbourhub/shared';
import { AppError } from './errorHandler';
import { prisma } from '../config/database';

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

export const requireSocietyAdmin = (getSocietyId: (req: Request) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));
    
    const societyId = getSocietyId(req);
    const society = await prisma.society.findUnique({ where: { id: societyId } });
    
    if (!society || society.adminId !== req.user.id) {
      return next(new AppError('Requires society admin privileges', 403));
    }
    next();
  };
};

export const requireBusinessOwner = (getBusinessId: (req: Request) => string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));
    
    const businessId = getBusinessId(req);
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    
    if (!business || business.ownerId !== req.user.id) {
      return next(new AppError('Requires business owner privileges', 403));
    }
    next();
  };
};
