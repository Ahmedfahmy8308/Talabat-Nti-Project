import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/middlewares/error.middleware';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

// Restaurant-specific middleware
export const validateRestaurantOwnership = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const restaurantId = req.params.restaurantId || req.params.id;
  
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Admin can access any restaurant's data
  if (req.user.role === 'admin') {
    return next();
  }

  // Restaurant owners can only access their own data
  if (req.user.role === 'restaurant' && req.user._id.toString() !== restaurantId) {
    throw new AppError('Access denied. You can only access your own restaurant data', 403);
  }

  next();
};

export const validateMealOwnership = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mealId = req.params.mealId || req.params.id;
    
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Admin can access any meal
    if (req.user.role === 'admin') {
      return next();
    }

    // Restaurant owners can only access their own meals
    // This would require importing the Meal model to check ownership
    // For now, we'll just check if user is a restaurant
    if (req.user.role !== 'restaurant') {
      throw new AppError('Access denied. Only restaurant owners can manage meals', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
