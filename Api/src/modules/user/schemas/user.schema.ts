import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'customer' | 'restaurant' | 'delivery';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  
  // Role-specific fields
  restaurantInfo?: {
    name: string;
    description: string;
    contactNumbers: string[];
    socialLinks?: {
      website?: string;
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    image?: string;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    cuisine?: string[];
    averageRating?: number;
    totalReviews?: number;
    isOpen?: boolean;
    openingHours?: {
      [key: string]: { open: string; close: string; };
    };
  };
  
  deliveryInfo?: {
    restaurantId?: string;
    licenseNumber?: string;
    vehicleType?: 'bicycle' | 'motorcycle' | 'car';
    vehiclePlate?: string;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    isAvailable?: boolean;
    currentLocation?: {
      lat: number;
      lng: number;
    };
    totalDeliveries?: number;
    averageRating?: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Don't include password in queries by default
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['admin', 'customer', 'restaurant', 'delivery'],
        message: 'Role must be one of: admin, customer, restaurant, delivery'
      },
      default: 'customer'
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number }
      }
    },
    avatar: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date
    },
    
    // Restaurant-specific fields
    restaurantInfo: {
      name: { 
        type: String, 
        trim: true,
        maxlength: [100, 'Restaurant name cannot be more than 100 characters']
      },
      description: { 
        type: String, 
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
      },
      contactNumbers: [{
        type: String,
        trim: true
      }],
      socialLinks: {
        website: { type: String, trim: true },
        facebook: { type: String, trim: true },
        instagram: { type: String, trim: true },
        twitter: { type: String, trim: true }
      },
      address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true },
        coordinates: {
          lat: { type: Number },
          lng: { type: Number }
        }
      },
      image: { type: String, trim: true },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
      },
      cuisine: [{ type: String, trim: true }],
      averageRating: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 5 
      },
      totalReviews: { 
        type: Number, 
        default: 0,
        min: 0 
      },
      isOpen: { type: Boolean, default: false },
      openingHours: {
        type: Map,
        of: {
          open: String,
          close: String
        }
      }
    },
    
    // Delivery person-specific fields
    deliveryInfo: {
      restaurantId: { 
        type: String, 
        ref: 'User' 
      },
      licenseNumber: { 
        type: String, 
        trim: true 
      },
      vehicleType: {
        type: String,
        enum: ['bicycle', 'motorcycle', 'car']
      },
      vehiclePlate: { 
        type: String, 
        trim: true 
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
      },
      isAvailable: { 
        type: Boolean, 
        default: false 
      },
      currentLocation: {
        lat: { type: Number },
        lng: { type: Number }
      },
      totalDeliveries: { 
        type: Number, 
        default: 0,
        min: 0 
      },
      averageRating: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 5 
      }
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete (ret as any).__v;
        delete (ret as any).password;
        return ret;
      }
    }
  }
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isEmailVerified: 1 });
userSchema.index({ createdAt: -1 });

// Role-specific indexes
userSchema.index({ 'restaurantInfo.status': 1 });
userSchema.index({ 'restaurantInfo.isOpen': 1 });
userSchema.index({ 'restaurantInfo.cuisine': 1 });
userSchema.index({ 'deliveryInfo.status': 1 });
userSchema.index({ 'deliveryInfo.isAvailable': 1 });
userSchema.index({ 'deliveryInfo.restaurantId': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name (handles restaurant names)
userSchema.virtual('displayName').get(function () {
  if (this.role === 'restaurant' && this.restaurantInfo?.name) {
    return this.restaurantInfo.name;
  }
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware for role-specific validation
userSchema.pre('save', function(next) {
  // Validate restaurant-specific required fields
  if (this.role === 'restaurant') {
    if (!this.restaurantInfo?.name) {
      return next(new Error('Restaurant name is required for restaurant role'));
    }
    if (!this.restaurantInfo?.description) {
      return next(new Error('Restaurant description is required for restaurant role'));
    }
    if (!this.restaurantInfo?.contactNumbers?.length) {
      return next(new Error('At least one contact number is required for restaurant role'));
    }
    if (!this.restaurantInfo?.address?.street || !this.restaurantInfo?.address?.city) {
      return next(new Error('Complete address is required for restaurant role'));
    }
  }
  
  // Validate delivery-specific required fields
  if (this.role === 'delivery') {
    if (!this.phone) {
      return next(new Error('Phone number is required for delivery role'));
    }
  }
  
  next();
});

// Static methods
userSchema.statics.findByRole = function(role: string) {
  return this.find({ role, isActive: true });
};

userSchema.statics.findRestaurants = function(filters: any = {}) {
  return this.find({ 
    role: 'restaurant', 
    isActive: true,
    'restaurantInfo.status': 'approved',
    ...filters 
  });
};

userSchema.statics.findAvailableDelivery = function(restaurantId?: string) {
  const query: any = { 
    role: 'delivery', 
    isActive: true,
    'deliveryInfo.status': 'approved',
    'deliveryInfo.isAvailable': true
  };
  
  if (restaurantId) {
    query['deliveryInfo.restaurantId'] = restaurantId;
  }
  
  return this.find(query);
};

export default mongoose.model<IUser>('User', userSchema);
