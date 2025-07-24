import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { Helpers } from '../../shared/utils/helpers';
import { AppError } from '../../shared/middlewares/error.middleware';

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body;

      // Basic validation
      if (!userData.email || !userData.password || !userData.role) {
        throw new AppError('Email, password, and role are required', 400);
      }

      const result = await AuthService.register(userData);

      res.status(201).json(Helpers.successResponse(
        result.message,
        result.user
      ));
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      const result = await AuthService.login({ email, password });

      res.status(200).json(Helpers.successResponse(
        'Login successful',
        {
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
        }
      ));
    } catch (error) {
      next(error);
    }
  }

  // Verify email with OTP
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        throw new AppError('Email and OTP are required', 400);
      }

      const result = await AuthService.verifyEmail({ email, otp });

      res.status(200).json(Helpers.successResponse(result.message));
    } catch (error) {
      next(error);
    }
  }

  // Resend OTP
  static async resendOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError('Email is required', 400);
      }

      const result = await AuthService.resendOTP({ email });

      res.status(200).json(Helpers.successResponse(result.message));
    } catch (error) {
      next(error);
    }
  }

  // Forgot password
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError('Email is required', 400);
      }

      const result = await AuthService.forgotPassword({ email });

      res.status(200).json(Helpers.successResponse(result.message));
    } catch (error) {
      next(error);
    }
  }

  // Reset password
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        throw new AppError('Email, OTP, and new password are required', 400);
      }

      const result = await AuthService.resetPassword({ email, otp, newPassword });

      res.status(200).json(Helpers.successResponse(result.message));
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }

      const result = await AuthService.refreshToken({ refreshToken });

      res.status(200).json(Helpers.successResponse(
        'Token refreshed successfully',
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
        }
      ));
    } catch (error) {
      next(error);
    }
  }

  // Change password (for authenticated users)
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = (req as any).user?.id || (req as any).user?._id;

      if (!currentPassword || !newPassword) {
        throw new AppError('Current password and new password are required', 400);
      }

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const result = await AuthService.changePassword(userId, { currentPassword, newPassword });

      res.status(200).json(Helpers.successResponse(result.message));
    } catch (error) {
      next(error);
    }
  }

  // Logout
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.logout();

      res.status(200).json(Helpers.successResponse(result.message));
    } catch (error) {
      next(error);
    }
  }
}
