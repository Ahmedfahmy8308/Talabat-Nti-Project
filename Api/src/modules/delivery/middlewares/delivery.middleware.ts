import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/middlewares/error.middleware';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

// Delivery-specific middleware
export const validateDeliveryPersonAssignment = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const deliveryPersonId = req.params.deliveryPersonId || req.body.deliveryPersonId;
  
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Admin can assign any delivery person
  if (req.user.role === 'admin') {
    return next();
  }

  // Delivery persons can only manage their own deliveries
  if (req.user.role === 'delivery' && req.user._id.toString() !== deliveryPersonId) {
    throw new AppError('Access denied. You can only manage your own deliveries', 403);
  }

  next();
};

export const validateDeliveryStatus = (req: Request, res: Response, next: NextFunction): void => {
  const { status } = req.body;
  const validStatuses = ['pending', 'accepted', 'picked_up', 'delivered', 'cancelled'];
  
  if (status && !validStatuses.includes(status)) {
    throw new AppError(`Invalid delivery status. Valid statuses are: ${validStatuses.join(', ')}`, 400);
  }

  next();
};
