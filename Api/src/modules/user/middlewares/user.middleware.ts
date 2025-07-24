import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/middlewares/error.middleware';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

// User-specific middleware
export const validateUserOwnership = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const userId = req.params.userId || req.params.id;
  
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Admin can access any user's data
  if (req.user.role === 'admin') {
    return next();
  }

  // Users can only access their own data
  if (req.user._id.toString() !== userId) {
    throw new AppError('Access denied. You can only access your own data', 403);
  }

  next();
};

export const requireEmailVerification = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (!req.user.isEmailVerified) {
    throw new AppError('Please verify your email address first', 400);
  }

  next();
};
