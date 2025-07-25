import { Document, Schema } from 'mongoose';
import { User, IBaseUser } from '../../shared/schemas/base-user.schema';

export interface ICustomer extends IBaseUser {
  role: 'customer';
  orderHistory?: string[];
  favoriteRestaurants?: string[];
  deliveryPreferences?: {
    preferredDeliveryTime?: string;
    specialInstructions?: string;
  };
  loyaltyPoints?: number;
}

const customerSchema = new Schema({
  orderHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  favoriteRestaurants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  deliveryPreferences: {
    preferredDeliveryTime: {
      type: String,
      trim: true,
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [200, 'Special instructions cannot exceed 200 characters'],
    },
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0,
  },
});

customerSchema.index({ loyaltyPoints: -1 });
customerSchema.index({ favoriteRestaurants: 1 });

customerSchema.methods.addLoyaltyPoints = function (points: number) {
  this.loyaltyPoints = (this.loyaltyPoints || 0) + points;
  return this.save();
};

customerSchema.methods.redeemLoyaltyPoints = function (points: number) {
  if ((this.loyaltyPoints || 0) >= points) {
    this.loyaltyPoints = (this.loyaltyPoints || 0) - points;
    return this.save();
  }
  throw new Error('Insufficient loyalty points');
};

customerSchema.methods.addToFavorites = function (restaurantId: string) {
  if (!this.favoriteRestaurants) {
    this.favoriteRestaurants = [];
  }
  if (!this.favoriteRestaurants.includes(restaurantId)) {
    this.favoriteRestaurants.push(restaurantId);
    return this.save();
  }
};

customerSchema.methods.removeFromFavorites = function (restaurantId: string) {
  if (this.favoriteRestaurants) {
    this.favoriteRestaurants = this.favoriteRestaurants.filter(
      (id: string) => id.toString() !== restaurantId,
    );
    return this.save();
  }
};

customerSchema.statics.findByLoyaltyPoints = function (minPoints: number) {
  return this.find({
    role: 'customer',
    isActive: true,
    loyaltyPoints: { $gte: minPoints },
  });
};

customerSchema.statics.findWithFavoriteRestaurant = function (
  restaurantId: string,
) {
  return this.find({
    role: 'customer',
    isActive: true,
    favoriteRestaurants: restaurantId,
  });
};

export const Customer = User.discriminator<ICustomer>(
  'customer',
  customerSchema,
);
