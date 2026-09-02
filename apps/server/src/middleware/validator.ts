import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      next(new AppError('Validation Error', 400));
    }
  };
};
