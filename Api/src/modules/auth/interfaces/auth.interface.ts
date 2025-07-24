import { UserRole } from '../../shared/interfaces';

// Authentication DTOs
export interface IRegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  [key: string]: any; // Additional role-specific fields
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
    status: string;
    isEmailVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  expiresIn: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface IVerifyEmailRequest {
  email: string;
  otp: string;
}

export interface IResendOTPRequest {
  email: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// OTP related interfaces
export interface IOTPRecord {
  email: string;
  otp: string;
  purpose: 'email_verification' | 'password_reset';
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

// JWT payload interface
export interface IJWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Authentication service interface
export interface IAuthService {
  register(data: IRegisterRequest): Promise<{ user: any; message: string }>;
  login(data: ILoginRequest): Promise<ILoginResponse>;
  refreshToken(data: IRefreshTokenRequest): Promise<IRefreshTokenResponse>;
  verifyEmail(data: IVerifyEmailRequest): Promise<{ message: string }>;
  resendOTP(data: IResendOTPRequest): Promise<{ message: string }>;
  forgotPassword(data: IForgotPasswordRequest): Promise<{ message: string }>;
  resetPassword(data: IResetPasswordRequest): Promise<{ message: string }>;
  changePassword(userId: string, data: IChangePasswordRequest): Promise<{ message: string }>;
  logout(userId: string, refreshToken: string): Promise<{ message: string }>;
  logoutAll(userId: string): Promise<{ message: string }>;
}

export interface IAuthController {
  login(req: any, res: any, next: any): Promise<void>;
  register(req: any, res: any, next: any): Promise<void>;
  refreshToken(req: any, res: any, next: any): Promise<void>;
  verifyEmail(req: any, res: any, next: any): Promise<void>;
  resendOTP(req: any, res: any, next: any): Promise<void>;
  forgotPassword(req: any, res: any, next: any): Promise<void>;
  resetPassword(req: any, res: any, next: any): Promise<void>;
  changePassword(req: any, res: any, next: any): Promise<void>;
  logout(req: any, res: any, next: any): Promise<void>;
  logoutAll(req: any, res: any, next: any): Promise<void>;
}

export interface IAuthResponse {
  token: string;
  user: any;
  expiresIn: number;
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
