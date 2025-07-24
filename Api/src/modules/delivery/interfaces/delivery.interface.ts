export interface IDeliveryService {
  // Define delivery service interface methods here
}

export interface IDeliveryController {
  // Define delivery controller interface methods here
}

export interface IDelivery {
  _id: string;
  orderId: string;
  deliveryPersonId: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
  estimatedTime?: number;
  actualTime?: number;
  createdAt: Date;
  updatedAt: Date;
}
