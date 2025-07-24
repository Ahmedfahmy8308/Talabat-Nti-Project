import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import User, { IUser } from '../../user/schemas/user.schema';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Access denied. No token provided', 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT secret not configured', 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new AppError('Invalid token', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Access denied. User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(`Access denied. Required roles: ${roles.join(', ')}`, 403);
    }

    next();
  };
};

// Specific role middlewares
export const isAdmin = authorize('admin');
export const isCustomer = authorize('customer');
export const isRestaurant = authorize('restaurant');
export const isDelivery = authorize('delivery');
export const isRestaurantOrAdmin = authorize('restaurant', 'admin');
export const isDeliveryOrAdmin = authorize('delivery', 'admin');
