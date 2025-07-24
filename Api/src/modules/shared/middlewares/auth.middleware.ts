import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import User, { IUser } from '../../user/schemas/user.schema';
import { IJWTPayload } from '../../auth/interfaces/auth.interface';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
  userRole?: string;
}

// Main authentication middleware
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    let token: string;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'] as string;
    } else {
      throw new AppError('Access denied. No token provided', 401);
    }

    // Verify JWT secret exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT secret not configured', 500);
    }

    // Verify and decode token
    let decoded: IJWTPayload;
    try {
      decoded = jwt.verify(token, jwtSecret) as IJWTPayload;
    } catch (jwtError: any) {
      if (jwtError.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', 401);
      } else if (jwtError.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token', 401);
      } else {
        throw new AppError('Token verification failed', 401);
      }
    }

    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('User account is deactivated', 401);
    }

    // Attach user info to request
    req.user = user;
    req.userId = user._id.toString();
    req.userRole = user.role;

    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      return next(); // Continue without authentication
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as IJWTPayload;
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id.toString();
        req.userRole = user.role;
      }
    } catch (jwtError) {
      // Ignore token errors in optional authentication
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization middleware
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

// Email verification check middleware
export const requireEmailVerification = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (!req.user.isEmailVerified) {
    throw new AppError('Email verification required', 403);
  }

  next();
};

// Account status check middleware
export const requireActiveAccount = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  if (!req.user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  next();
};

// Combined middleware for strict authentication requirements
export const strictAuthenticate = [
  authenticate,
  requireEmailVerification,
  requireActiveAccount
];

// Specific role middlewares
export const isAdmin = [authenticate, authorize('admin')];
export const isCustomer = [authenticate, authorize('customer')];
export const isRestaurant = [authenticate, authorize('restaurant')];
export const isDelivery = [authenticate, authorize('delivery')];

// Combined role middlewares
export const isRestaurantOrAdmin = [authenticate, authorize('restaurant', 'admin')];
export const isDeliveryOrAdmin = [authenticate, authorize('delivery', 'admin')];
export const isCustomerOrAdmin = [authenticate, authorize('customer', 'admin')];

// Middleware to check if user owns the resource
export const checkResourceOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    const currentUserId = req.user._id.toString();

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // User can only access their own resources
    if (resourceUserId !== currentUserId) {
      throw new AppError('Access denied. You can only access your own resources', 403);
    }

    next();
  };
};

// Rate limiting middleware for auth endpoints
export const authRateLimit = (maxRequests: number = 5, windowMinutes: number = 15) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    const clientAttempts = attempts.get(clientIP);

    if (!clientAttempts || now > clientAttempts.resetTime) {
      // First attempt or window expired
      attempts.set(clientIP, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (clientAttempts.count >= maxRequests) {
      throw new AppError(`Too many authentication attempts. Try again in ${windowMinutes} minutes`, 429);
    }

    clientAttempts.count++;
    attempts.set(clientIP, clientAttempts);
    next();
  };
};
