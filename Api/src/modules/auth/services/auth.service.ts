import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../user/schemas/user.schema';
import OTP, { IOTPDocument } from '../schemas/otp.schema';
import { AppError } from '../../shared/middlewares/error.middleware';
import { emailService } from '../../shared/utils/email.service';
import { Helpers } from '../../shared/utils/helpers';
import { 
  IRegistrationData, 
  ILoginCredentials, 
  IAuthResponse, 
  IVerifyEmailRequest, 
  IResendOTPRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IRefreshTokenRequest,
  IAuthTokens,
  IJWTPayload 
} from '../interfaces/auth.interface';

// Extend OTP model interface for static methods
interface IOTPModel extends IOTPDocument {
  findValidOTP(email: string, otp: string, purpose: string): Promise<IOTPDocument | null>;
  createOTP(email: string, otp: string, purpose: string): Promise<IOTPDocument>;
  incrementAttempts(email: string, purpose: string): Promise<any>;
}

export class AuthService {
  // Generate tokens
  private static generateTokens(userId: string, email: string, role: string): IAuthTokens {
    const payload: IJWTPayload = { userId, email, role };
    
    const accessToken = Helpers.generateAccessToken(payload);
    const refreshToken = Helpers.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  // Verify refresh token and generate new access token
  static async refreshToken(data: IRefreshTokenRequest): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { refreshToken } = data;
      
      // Verify refresh token
      const decoded = Helpers.verifyToken(refreshToken) as IJWTPayload;
      
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const tokens = this.generateTokens(user._id.toString(), user.email, user.role);
      
      return tokens;
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  // Register new user
  static async register(userData: IRegistrationData): Promise<{ user: Partial<IUser>; message: string }> {
    const { email, password: userPassword, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await Helpers.hashPassword(userPassword);

    // Create user data based on role
    let userDoc: any = {
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      isActive: true,
      isEmailVerified: false
    };

    // Add role-specific fields
    switch (role) {
      case 'customer':
        const customerData = userData as any;
        userDoc = {
          ...userDoc,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
          address: customerData.address
        };
        break;

      case 'restaurant':
        const restaurantData = userData as any;
        userDoc = {
          ...userDoc,
          firstName: restaurantData.name, // Store restaurant name as firstName for consistency
          lastName: 'Restaurant', // Default lastName for restaurants
          restaurantInfo: {
            name: restaurantData.name,
            description: restaurantData.description,
            contactNumbers: restaurantData.contactNumbers,
            socialLinks: restaurantData.socialLinks,
            address: restaurantData.address,
            image: restaurantData.image,
            status: 'pending' // Restaurants start as pending approval
          }
        };
        break;

      case 'delivery':
        const deliveryData = userData as any;
        userDoc = {
          ...userDoc,
          firstName: deliveryData.name.split(' ')[0] || deliveryData.name,
          lastName: deliveryData.name.split(' ').slice(1).join(' ') || 'Driver',
          phone: deliveryData.phone,
          deliveryInfo: {
            restaurantId: deliveryData.restaurantId,
            licenseNumber: deliveryData.licenseNumber,
            vehicleType: deliveryData.vehicleType,
            vehiclePlate: deliveryData.vehiclePlate,
            status: 'pending' // Delivery personnel start as pending approval
          }
        };
        break;
    }

    // Create user
    const user = new User(userDoc);
    await user.save();

    // Generate and send OTP for email verification
    const otp = Helpers.generateOTP();
    await (OTP as any).createOTP(email.toLowerCase(), otp, 'email_verification');
    
    // Send verification email
    try {
      await emailService.sendOTPEmail(email, otp, 'verification');
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't throw error, user is created successfully
    }

    // Return user without sensitive data
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return {
      user: userWithoutPassword,
      message: 'User registered successfully. Please check your email for verification code.'
    };
  }

  // Login user
  static async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    const { email, password } = credentials;

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account has been deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await Helpers.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = this.generateTokens(user._id.toString(), user.email, user.role);

    // Return user without password
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return {
      user: userWithoutPassword,
      tokens
    };
  }

  // Verify email with OTP
  static async verifyEmail(data: IVerifyEmailRequest): Promise<{ message: string }> {
    const { email, otp } = data;

    // Find valid OTP
    const otpRecord = await (OTP as any).findValidOTP(email.toLowerCase(), otp, 'email_verification');
    if (!otpRecord) {
      // Increment attempts
      await (OTP as any).incrementAttempts(email.toLowerCase(), 'email_verification');
      throw new AppError('Invalid or expired OTP', 400);
    }

    // Check if max attempts reached
    if (otpRecord.isMaxAttemptsReached()) {
      throw new AppError('Maximum OTP attempts reached. Please request a new OTP.', 400);
    }

    // Find and update user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Mark email as verified
    user.isEmailVerified = true;
    await user.save();

    // Mark OTP as used
    await otpRecord.markAsUsed();

    // Send welcome email
    try {
      const name = user.firstName || user.email;
      await emailService.sendWelcomeEmail(user.email, name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return { message: 'Email verified successfully!' };
  }

  // Resend OTP
  static async resendOTP(data: IResendOTPRequest): Promise<{ message: string }> {
    const { email } = data;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.isEmailVerified) {
      throw new AppError('Email is already verified', 400);
    }

    // Generate new OTP
    const otp = Helpers.generateOTP();
    await (OTP as any).createOTP(email.toLowerCase(), otp, 'email_verification');

    // Send OTP
    await emailService.sendOTPEmail(email, otp, 'verification');

    return { message: 'OTP sent successfully to your email' };
  }

  // Forgot password
  static async forgotPassword(data: IForgotPasswordRequest): Promise<{ message: string }> {
    const { email } = data;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists or not
      return { message: 'If an account with this email exists, you will receive a password reset email.' };
    }

    // Generate OTP for password reset
    const otp = Helpers.generateOTP();
    await (OTP as any).createOTP(email.toLowerCase(), otp, 'password_reset');

    // Send reset email
    try {
      await emailService.sendOTPEmail(email, otp, 'reset');
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      throw new AppError('Failed to send password reset email', 500);
    }

    return { message: 'Password reset instructions sent to your email' };
  }

  // Reset password
  static async resetPassword(data: IResetPasswordRequest): Promise<{ message: string }> {
    const { email, otp, newPassword } = data;

    // Find valid OTP
    const otpRecord = await (OTP as any).findValidOTP(email.toLowerCase(), otp, 'password_reset');
    if (!otpRecord) {
      await (OTP as any).incrementAttempts(email.toLowerCase(), 'password_reset');
      throw new AppError('Invalid or expired OTP', 400);
    }

    // Check max attempts
    if (otpRecord.isMaxAttemptsReached()) {
      throw new AppError('Maximum OTP attempts reached. Please request a new password reset.', 400);
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Hash new password
    const hashedPassword = await Helpers.hashPassword(newPassword);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Mark OTP as used
    await otpRecord.markAsUsed();

    return { message: 'Password reset successfully!' };
  }

  // Change password (for authenticated users)
  static async changePassword(userId: string, data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const { currentPassword, newPassword } = data;

    // Find user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await Helpers.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedPassword = await Helpers.hashPassword(newPassword);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password changed successfully!' };
  }

  // Logout (basic implementation)
  static async logout(): Promise<{ message: string }> {
    // In a more sophisticated implementation, you would:
    // 1. Add the token to a blacklist
    // 2. Clear any server-side sessions
    // 3. Update last activity timestamp
    
    return { message: 'Logged out successfully' };
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<IUser | null> {
    try {
      const decoded = Helpers.verifyToken(token) as IJWTPayload;
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }
}
