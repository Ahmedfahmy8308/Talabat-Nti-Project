import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IApiResponse, IPagination, IQueryParams } from '../interfaces';
import { Document } from 'mongoose';

export class Helpers {
  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // JWT token utilities
  static generateAccessToken(payload: object): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
    } as any);
  }

  static generateRefreshToken(payload: object): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    } as any);
  }

  static verifyToken(token: string): any {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    return jwt.verify(token, secret);
  }

  // OTP generation
  static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  // Generate random token
  static generateRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // API Response formatters
  static successResponse<T>(message: string, data?: T, pagination?: IPagination): IApiResponse<T> {
    return {
      success: true,
      message,
      data,
      pagination
    };
  }

  static errorResponse(message: string, error?: string): IApiResponse {
    return {
      success: false,
      message,
      error
    };
  }

  // Pagination helper
  static calculatePagination(query: IQueryParams, total: number): IPagination {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 10));
    const pages = Math.ceil(total / limit);
    
    return {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1
    };
  }

  // Query builder helper
  static buildQuery(queryParams: IQueryParams): {
    filter: Record<string, any>;
    sort: Record<string, 1 | -1>;
    skip: number;
    limit: number;
  } {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', filter = {} } = queryParams;
    
    // Build filter
    const queryFilter: Record<string, any> = { isDeleted: { $ne: true }, ...filter };
    
    // Add search functionality
    if (search) {
      queryFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    return {
      filter: queryFilter,
      sort,
      skip,
      limit: Math.min(100, limit) // Limit max results
    };
  }

  // Soft delete helper
  static softDelete(doc: Document & { isDeleted?: boolean; deletedAt?: Date }): void {
    doc.isDeleted = true;
    doc.deletedAt = new Date();
  }

  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  // Format phone number
  static formatPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  // Generate order number
  static generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp.slice(-6)}-${random}`;
  }

  // Calculate distance between two coordinates (Haversine formula)
  static calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  private static degToRad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static isValidPassword(password: string): boolean {
    // At least 6 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  }

  // Extract file extension
  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  // Generate unique filename
  static generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = this.getFileExtension(originalName);
    return `${timestamp}-${random}.${extension}`;
  }
}

// Legacy exports for backward compatibility
export const hashPassword = Helpers.hashPassword;
export const comparePassword = Helpers.comparePassword;
export const generateToken = (userId: string) => Helpers.generateAccessToken({ userId });
export const generateRandomString = (length: number = 10) => Helpers.generateRandomToken(length);
export const formatResponse = Helpers.successResponse;
export const calculatePagination = (page: number, limit: number, total: number) => 
  Helpers.calculatePagination({ page, limit }, total);
