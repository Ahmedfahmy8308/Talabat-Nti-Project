import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  _id: string;
  customerId: string;
  restaurantId: string;
  deliveryPersonId?: string;
  items: {
    mealId: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
  }[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    instructions?: string;
  };
  customerInfo: {
    name: string;
    phone: string;
  };
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  finalAmount: number;
  paymentMethod: 'cash' | 'card' | 'digital_wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customerId: {
      type: String,
      required: [true, 'Customer ID is required'],
      ref: 'User'
    },
    restaurantId: {
      type: String,
      required: [true, 'Restaurant ID is required'],
      ref: 'User'
    },
    deliveryPersonId: {
      type: String,
      ref: 'User'
    },
    items: [{
      mealId: {
        type: String,
        required: [true, 'Meal ID is required'],
        ref: 'Meal'
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
      },
      price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
      },
      specialInstructions: {
        type: String,
        trim: true,
        maxlength: [200, 'Special instructions cannot be more than 200 characters']
      }
    }],
    status: {
      type: String,
      required: [true, 'Order status is required'],
      enum: {
        values: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'],
        message: 'Status must be one of: pending, confirmed, preparing, ready, picked_up, delivered, cancelled'
      },
      default: 'pending'
    },
    deliveryAddress: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true
      },
      coordinates: {
        lat: {
          type: Number,
          required: [true, 'Latitude is required']
        },
        lng: {
          type: Number,
          required: [true, 'Longitude is required']
        }
      },
      instructions: {
        type: String,
        trim: true,
        maxlength: [200, 'Delivery instructions cannot be more than 200 characters']
      }
    },
    customerInfo: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Customer phone is required'],
        trim: true
      }
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    deliveryFee: {
      type: Number,
      required: [true, 'Delivery fee is required'],
      min: [0, 'Delivery fee cannot be negative'],
      default: 2.99
    },
    tax: {
      type: Number,
      required: [true, 'Tax is required'],
      min: [0, 'Tax cannot be negative']
    },
    finalAmount: {
      type: Number,
      required: [true, 'Final amount is required'],
      min: [0, 'Final amount cannot be negative']
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['cash', 'card', 'digital_wallet'],
        message: 'Payment method must be one of: cash, card, digital_wallet'
      }
    },
    paymentStatus: {
      type: String,
      required: [true, 'Payment status is required'],
      enum: {
        values: ['pending', 'paid', 'failed', 'refunded'],
        message: 'Payment status must be one of: pending, paid, failed, refunded'
      },
      default: 'pending'
    },
    estimatedDeliveryTime: {
      type: Date
    },
    actualDeliveryTime: {
      type: Date
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot be more than 500 characters']
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete (ret as any).__v;
        return ret;
      }
    }
  }
);

// Indexes for better performance
orderSchema.index({ customerId: 1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ deliveryPersonId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'deliveryAddress.coordinates': '2dsphere' });

export default mongoose.model<IOrder>('Order', orderSchema);
