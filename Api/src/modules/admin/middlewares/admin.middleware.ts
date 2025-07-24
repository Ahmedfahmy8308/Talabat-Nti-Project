import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/middlewares/error.middleware';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

// Admin-specific middleware
export const validateAdminAction = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (req.user.role !== 'admin') {
    throw new AppError('Access denied. Admin privileges required', 403);
  }

  next();
};

export const preventSelfRoleChange = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const targetUserId = req.params.userId || req.params.id;
  
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Prevent admin from changing their own role
  if (req.user._id.toString() === targetUserId && req.body.role) {
    throw new AppError('You cannot change your own role', 400);
  }

  next();
};

export const validateRoleChange = (req: Request, res: Response, next: NextFunction): void => {
  const { role } = req.body;
  const validRoles = ['admin', 'customer', 'restaurant', 'delivery'];
  
  if (role && !validRoles.includes(role)) {
    throw new AppError(`Invalid role. Valid roles are: ${validRoles.join(', ')}`, 400);
  }

  next();
};
