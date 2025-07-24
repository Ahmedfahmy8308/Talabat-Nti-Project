import { Request } from 'express';
import { Document, Types } from 'mongoose';

// Base interfaces
export interface IBaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
}

// User roles enum
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  RESTAURANT = 'restaurant',
  DELIVERY = 'delivery'
}

// User status enum
export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PREPARING = 'preparing',
  ASSIGNED = 'assigned',
  ON_THE_WAY = 'on-the-way',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// Restaurant status enum
export enum RestaurantStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

// Base user interface
export interface IUser extends IBaseDocument {
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  lastLoginAt?: Date;
}

// Extended request interface with user
export interface IAuthenticatedRequest extends Request {
  user?: IUser;
  userId?: string;
  userRole?: UserRole;
}

// API Response interface
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: IPagination;
}

// Pagination interface
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Query parameters interface
export interface IQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

// Email configuration interface
export interface IEmailConfig {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
}

// File upload interface
export interface IFileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
