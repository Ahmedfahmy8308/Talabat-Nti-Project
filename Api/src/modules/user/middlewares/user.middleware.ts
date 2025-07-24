import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/middlewares/error.middleware';
import { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';

export const validateUserOwnership = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const userId = req.params.userId || req.params.id;

  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user._id.toString() !== userId) {
    throw new AppError('Access denied. You can only access your own data', 403);
  }

  next();
};

export const requireEmailVerification = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (!req.user.isEmailVerified) {
    throw new AppError('Please verify your email address first', 400);
  }

  next();
};
