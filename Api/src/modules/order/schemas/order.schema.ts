import mongoose, { Schema, Document } from 'mongoose';
import { OrderStatus } from '../../shared/interfaces';

export interface IOrderItem {
  mealId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  totalPrice: number;
}

export interface IOrder extends Document {
  _id: string;
  orderNumber: string;
  customerId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  deliveryUserId?: mongoose.Types.ObjectId;
  
  // Customer details
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    notes?: string;
  };
  
  // Order items
  items: IOrderItem[];
  
  // Pricing
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  
  // Status and tracking
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    notes?: string;
    updatedBy?: mongoose.Types.ObjectId;
  }[];
  
  // Timing
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  preparationStartTime?: Date;
  preparationEndTime?: Date;
  pickupTime?: Date;
  
  // Payment
  paymentMethod: 'cash' | 'card' | 'digital_wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  
  // Special instructions
  specialInstructions?: string;
  
  // Ratings and feedback
  customerRating?: {
    overall: number;
    food: number;
    delivery: number;
    comment?: string;
    ratedAt: Date;
  };
  
  restaurantRating?: {
    customer: number;
    comment?: string;
    ratedAt: Date;
  };
  
  // Cancellation
  cancellationReason?: string;
  cancelledBy?: mongoose.Types.ObjectId;
  cancelledAt?: Date;
  
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  mealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 200
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const statusHistorySchema = new Schema({
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 200
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  deliveryUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  // Customer details
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  deliveryAddress: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 200
    }
  },
  
  // Order items
  items: [orderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  discount: {
    type: Number,
    min: 0,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Status and tracking
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
    index: true
  },
  statusHistory: [statusHistorySchema],
  
  // Timing
  estimatedDeliveryTime: {
    type: Date,
    required: true
  },
  actualDeliveryTime: Date,
  preparationStartTime: Date,
  preparationEndTime: Date,
  pickupTime: Date,
  
  // Payment
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'digital_wallet'],
    required: true,
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentId: String,
  
  // Special instructions
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Ratings and feedback
  customerRating: {
    overall: {
      type: Number,
      min: 1,
      max: 5
    },
    food: {
      type: Number,
      min: 1,
      max: 5
    },
    delivery: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500
    },
    ratedAt: Date
  },
  
  restaurantRating: {
    customer: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500
    },
    ratedAt: Date
  },
  
  // Cancellation
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: 200
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,
  
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Compound indexes for efficient queries
orderSchema.index({ customerId: 1, status: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, status: 1, createdAt: -1 });
orderSchema.index({ deliveryUserId: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, status: 1 });
orderSchema.index({ 'deliveryAddress.coordinates': '2dsphere' });

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Static methods
orderSchema.statics.findByCustomer = function(customerId: string) {
  return this.find({ 
    customerId, 
    isDeleted: { $ne: true } 
  }).sort({ createdAt: -1 });
};

orderSchema.statics.findByRestaurant = function(restaurantId: string) {
  return this.find({ 
    restaurantId, 
    isDeleted: { $ne: true } 
  }).sort({ createdAt: -1 });
};

orderSchema.statics.findByDeliveryUser = function(deliveryUserId: string) {
  return this.find({ 
    deliveryUserId, 
    isDeleted: { $ne: true } 
  }).sort({ createdAt: -1 });
};

orderSchema.statics.findActiveOrders = function() {
  return this.find({
    status: { 
      $in: [
        OrderStatus.PENDING,
        OrderStatus.ACCEPTED,
        OrderStatus.PREPARING,
        OrderStatus.ASSIGNED,
        OrderStatus.ON_THE_WAY
      ]
    },
    isDeleted: { $ne: true }
  });
};

// Instance methods
orderSchema.methods.updateStatus = function(newStatus: OrderStatus, notes?: string, updatedBy?: string) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    notes,
    updatedBy
  });
  
  // Update specific timing fields based on status
  switch (newStatus) {
    case OrderStatus.PREPARING:
      this.preparationStartTime = new Date();
      break;
    case OrderStatus.ASSIGNED:
      this.preparationEndTime = new Date();
      break;
    case OrderStatus.ON_THE_WAY:
      this.pickupTime = new Date();
      break;
    case OrderStatus.DELIVERED:
      this.actualDeliveryTime = new Date();
      break;
  }
  
  return this.save();
};

orderSchema.methods.cancel = function(reason: string, cancelledBy?: string) {
  this.status = OrderStatus.CANCELLED;
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  
  this.statusHistory.push({
    status: OrderStatus.CANCELLED,
    timestamp: new Date(),
    notes: reason,
    updatedBy: cancelledBy
  });
  
  return this.save();
};

export const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
