import { Document, Types } from 'mongoose';
import { 
  IUser, 
  IBaseDocument, 
  UserRole, 
  UserStatus 
} from '../../shared/interfaces';

// Extended user interface for customers
export interface ICustomer extends IUser {
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  preferences?: {
    cuisineTypes: string[];
    dietaryRestrictions: string[];
    notifications: {
      orderUpdates: boolean;
      promotions: boolean;
      newsletter: boolean;
    };
  };
  orderHistory: Types.ObjectId[];
  favoriteRestaurants: Types.ObjectId[];
}

// Extended user interface for restaurants
export interface IRestaurant extends IUser {
  name: string;
  description: string;
  image?: string;
  coverImage?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  contactNumbers: string[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  businessHours: {
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  cuisineTypes: string[];
  deliveryFee: number;
  minimumOrderAmount: number;
  estimatedDeliveryTime: number; // in minutes
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  approvedBy?: Types.ObjectId;
  rejectionReason?: string;
  deliveryUsers: Types.ObjectId[];
  menu: Types.ObjectId[];
}

// Extended user interface for delivery users
export interface IDeliveryUser extends IUser {
  firstName: string;
  lastName: string;
  phone: string;
  restaurantId: Types.ObjectId;
  vehicleType: 'bike' | 'motorcycle' | 'car';
  vehicleDetails?: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    updatedAt: Date;
  };
  completedDeliveries: number;
  rating: {
    average: number;
    count: number;
  };
  activeOrder?: Types.ObjectId;
}

// Admin interface (basic user with admin role)
export interface IAdmin extends IUser {
  name: string;
  permissions: string[];
}

// User profile update interfaces
export interface IUpdateCustomerProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };
  preferences?: {
    cuisineTypes?: string[];
    dietaryRestrictions?: string[];
    notifications?: {
      orderUpdates?: boolean;
      promotions?: boolean;
      newsletter?: boolean;
    };
  };
}

export interface IUpdateRestaurantProfile {
  name?: string;
  description?: string;
  image?: string;
  coverImage?: string;
  contactNumbers?: string[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  businessHours?: {
    day: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
  cuisineTypes?: string[];
  deliveryFee?: number;
  minimumOrderAmount?: number;
  estimatedDeliveryTime?: number;
}

export interface IUpdateDeliveryProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  vehicleType?: 'bike' | 'motorcycle' | 'car';
  vehicleDetails?: {
    make?: string;
    model?: string;
    year?: number;
    licensePlate?: string;
  };
  isAvailable?: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

// Search and filter interfaces
export interface IUserSearchQuery {
  role?: UserRole;
  status?: UserStatus;
  isEmailVerified?: boolean;
  search?: string;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IRestaurantSearchQuery {
  cuisineTypes?: string[];
  city?: string;
  isActive?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  minRating?: number;
  maxDeliveryFee?: number;
  search?: string;
  latitude?: number;
  longitude?: number;
  maxDistance?: number; // in kilometers
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Analytics interfaces
export interface IUserAnalytics {
  totalUsers: number;
  activeUsers: number;
  usersByRole: {
    customers: number;
    restaurants: number;
    deliveryUsers: number;
    admins: number;
  };
  usersByStatus: {
    active: number;
    pending: number;
    suspended: number;
    banned: number;
  };
  newUsersThisMonth: number;
  userGrowthRate: number;
}

export interface IRestaurantAnalytics {
  totalRestaurants: number;
  activeRestaurants: number;
  pendingApprovals: number;
  approvedThisMonth: number;
  topRestaurantsByRating: {
    id: string;
    name: string;
    rating: number;
    orderCount: number;
  }[];
  restaurantsByCity: {
    city: string;
    count: number;
  }[];
}

// Legacy interfaces for backward compatibility
export interface IUser_Legacy extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserService {
  updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser>;
  deleteUser(userId: string): Promise<void>;
  getUserById(userId: string): Promise<IUser | null>;
}

export interface IUserController {
  getProfile(req: any, res: any, next: any): Promise<void>;
  updateProfile(req: any, res: any, next: any): Promise<void>;
  deleteAccount(req: any, res: any, next: any): Promise<void>;
}
