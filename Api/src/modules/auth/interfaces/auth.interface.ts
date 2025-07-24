import { UserRole } from '../../shared/interfaces';
import { IUser } from '../../user/schemas/user.schema';

// Registration interfaces for different roles
export interface IBaseRegistration {
  email: string;
  password: string;
  role: 'customer' | 'restaurant' | 'delivery';
}

export interface ICustomerRegistration extends IBaseRegistration {
  role: 'customer';
  firstName: string;
  lastName: string;
  phone?: string;
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
}

export interface IRestaurantRegistration extends IBaseRegistration {
  role: 'restaurant';
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
}

export interface IDeliveryRegistration extends IBaseRegistration {
  role: 'delivery';
  name: string;
  phone: string;
  restaurantId?: string; // Optional, can be assigned later by admin
  licenseNumber?: string;
  vehicleType?: 'bicycle' | 'motorcycle' | 'car';
  vehiclePlate?: string;
}

export type IRegistrationData = ICustomerRegistration | IRestaurantRegistration | IDeliveryRegistration;

// Authentication interfaces
export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: Partial<IUser>;
  tokens: IAuthTokens;
}

// OTP interfaces
export interface IOTPRequest {
  email: string;
  otp: string;
}

export interface IVerifyEmailRequest extends IOTPRequest {}

export interface IResendOTPRequest {
  email: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest extends IOTPRequest {
  newPassword: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Response interfaces
export interface ILoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
  tokens: IAuthTokens;
  expiresIn: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

// JWT payload interface
export interface IJWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Service response interfaces
export interface IServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface IAuthServiceResponse<T = any> extends IServiceResponse<T> {
  tokens?: IAuthTokens;
}

// Validation interfaces
export interface IValidationError {
  field: string;
  message: string;
}

export interface IValidationResult {
  isValid: boolean;
  errors: IValidationError[];
}

// Password requirements interface
export interface IPasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

// Security settings interface
export interface ISecuritySettings {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  otpExpiryTime: number; // in minutes
  otpMaxAttempts: number;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

// Authentication service interface
export interface IAuthService {
  register(data: IRegistrationData): Promise<{ user: Partial<IUser>; message: string }>;
  login(data: ILoginCredentials): Promise<ILoginResponse>;
  refreshToken(data: IRefreshTokenRequest): Promise<IRefreshTokenResponse>;
  verifyEmail(data: IVerifyEmailRequest): Promise<{ message: string }>;
  resendOTP(data: IResendOTPRequest): Promise<{ message: string }>;
  forgotPassword(data: IForgotPasswordRequest): Promise<{ message: string }>;
  resetPassword(data: IResetPasswordRequest): Promise<{ message: string }>;
  changePassword(userId: string, data: IChangePasswordRequest): Promise<{ message: string }>;
  logout(userId: string, refreshToken: string): Promise<{ message: string }>;
  logoutAll(userId: string): Promise<{ message: string }>;
}

// Social auth interfaces (future enhancement)
export interface ISocialAuthRequest {
  provider: 'google' | 'facebook' | 'apple';
  accessToken: string;
  idToken?: string;
}

export interface ISocialProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified: boolean;
}
