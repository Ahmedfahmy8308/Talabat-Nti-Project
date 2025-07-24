import { Request, Response, NextFunction } from 'express';
import { AuthService } from './service';
import { formatResponse } from '../../utils/helpers';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body;

      const result = await AuthService.register(userData);

      res.status(201).json(formatResponse(
        true,
        'User registered successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginData = req.body;

      const result = await AuthService.login(loginData);

      res.status(200).json(formatResponse(
        true,
        'User logged in successfully',
        result
      ));
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a more advanced implementation, you might want to:
      // 1. Add the token to a blacklist
      // 2. Clear any server-side sessions
      // 3. Update last activity timestamp

      res.status(200).json(formatResponse(
        true,
        'User logged out successfully'
      ));
    } catch (error) {
      next(error);
    }
  }
}
