import { Response, NextFunction } from 'express';
import { DeliveryService } from '../services/delivery.service';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';
import { formatResponse, calculatePagination } from '../../shared/utils/helpers';

export class DeliveryController {
  static async getAvailableOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const deliveryPersonId = req.user!._id;
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = parseInt(req.query.radius as string) || 10;

      let location: { lat: number; lng: number } | undefined;
      if (!isNaN(lat) && !isNaN(lng)) {
        location = { lat, lng };
      }

      const orders = await DeliveryService.getAvailableOrders(location, radius);

      res.status(200).json(formatResponse(
        true,
        'Available orders retrieved successfully',
        orders
      ));
    } catch (error) {
      next(error);
    }
  }

  static async acceptOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const deliveryPersonId = req.user!._id;
      const { orderId } = req.params;

      const order = await DeliveryService.acceptOrder(orderId, deliveryPersonId);

      res.status(200).json(formatResponse(
        true,
        'Order accepted successfully',
        order
      ));
    } catch (error) {
      next(error);
    }
  }

  static async getMyDeliveries(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const deliveryPersonId = req.user!._id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const { orders, total } = await DeliveryService.getMyDeliveries(
        deliveryPersonId,
        status,
        page,
        limit
      );

      const pagination = calculatePagination(page, limit, total);

      res.status(200).json(formatResponse(
        true,
        'Deliveries retrieved successfully',
        orders,
        pagination
      ));
    } catch (error) {
      next(error);
    }
  }

  static async updateDeliveryStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const deliveryPersonId = req.user!._id;
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await DeliveryService.updateDeliveryStatus(orderId, deliveryPersonId, status);

      res.status(200).json(formatResponse(
        true,
        'Delivery status updated successfully',
        order
      ));
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const deliveryPersonId = req.user!._id;
      const { orderId } = req.params;

      const order = await DeliveryService.getOrderById(orderId, deliveryPersonId);

      res.status(200).json(formatResponse(
        true,
        'Order retrieved successfully',
        order
      ));
    } catch (error) {
      next(error);
    }
  }

  static async getDeliveryStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const deliveryPersonId = req.user!._id;

      const stats = await DeliveryService.getDeliveryStats(deliveryPersonId);

      res.status(200).json(formatResponse(
        true,
        'Delivery statistics retrieved successfully',
        stats
      ));
    } catch (error) {
      next(error);
    }
  }
}
