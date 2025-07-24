import Order, { IOrder } from './model';
import { AppError } from '../../middlewares/error.middleware';

export class DeliveryService {
  static async getAvailableOrders(
    deliveryPersonLocation?: { lat: number; lng: number },
    radius: number = 10 // km
  ): Promise<IOrder[]> {
    const query: any = {
      status: 'ready',
      deliveryPersonId: { $exists: false }
    };

    // If location is provided, find orders within radius
    if (deliveryPersonLocation) {
      query['deliveryAddress.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [deliveryPersonLocation.lng, deliveryPersonLocation.lat]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    return await Order.find(query)
      .populate('customerId', 'firstName lastName phone')
      .populate('restaurantId', 'firstName lastName phone address')
      .sort({ createdAt: 1 }); // First come, first served
  }

  static async acceptOrder(orderId: string, deliveryPersonId: string): Promise<IOrder> {
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        status: 'ready',
        deliveryPersonId: { $exists: false }
      },
      {
        deliveryPersonId,
        status: 'picked_up',
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
      },
      { new: true }
    );

    if (!order) {
      throw new AppError('Order not found or already assigned', 404);
    }

    return order;
  }

  static async getMyDeliveries(
    deliveryPersonId: string,
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ orders: IOrder[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = { deliveryPersonId };

    if (status) {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('customerId', 'firstName lastName phone')
        .populate('restaurantId', 'firstName lastName phone address')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    return { orders, total };
  }

  static async updateDeliveryStatus(
    orderId: string,
    deliveryPersonId: string,
    status: string
  ): Promise<IOrder> {
    const validStatuses = ['picked_up', 'delivered'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status. Must be one of: picked_up, delivered', 400);
    }

    const updateData: any = { status };

    // If marking as delivered, set actual delivery time
    if (status === 'delivered') {
      updateData.actualDeliveryTime = new Date();
      updateData.paymentStatus = 'paid'; // Assuming payment is completed on delivery
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, deliveryPersonId },
      updateData,
      { new: true }
    );

    if (!order) {
      throw new AppError('Order not found or you are not assigned to this order', 404);
    }

    return order;
  }

  static async getOrderById(orderId: string, deliveryPersonId?: string): Promise<IOrder> {
    const query: any = { _id: orderId };
    if (deliveryPersonId) {
      query.deliveryPersonId = deliveryPersonId;
    }

    const order = await Order.findOne(query)
      .populate('customerId', 'firstName lastName phone')
      .populate('restaurantId', 'firstName lastName phone address')
      .populate('items.mealId', 'name price');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  static async getDeliveryStats(deliveryPersonId: string): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const [
      totalDeliveries,
      todayDeliveries,
      weekDeliveries,
      averageRating,
      totalEarnings
    ] = await Promise.all([
      Order.countDocuments({ deliveryPersonId, status: 'delivered' }),
      Order.countDocuments({
        deliveryPersonId,
        status: 'delivered',
        actualDeliveryTime: { $gte: today }
      }),
      Order.countDocuments({
        deliveryPersonId,
        status: 'delivered',
        actualDeliveryTime: { $gte: thisWeek }
      }),
      // This would require a separate ratings collection in a real app
      Promise.resolve(4.5), // Placeholder
      Order.aggregate([
        { $match: { deliveryPersonId, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$deliveryFee' } } }
      ]).then(result => result[0]?.total || 0)
    ]);

    return {
      totalDeliveries,
      todayDeliveries,
      weekDeliveries,
      averageRating,
      totalEarnings,
      activeOrders: await Order.countDocuments({
        deliveryPersonId,
        status: { $in: ['picked_up'] }
      })
    };
  }
}
