import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';
import { formatResponse } from '../../shared/utils/helpers';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;

      res.status(200).json(formatResponse(
        'Profile retrieved successfully',
        user
      ));
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id;
      const updateData = req.body;

      const updatedUser = await UserService.updateUser(userId, updateData);

      res.status(200).json(formatResponse(
        'Profile updated successfully',
        updatedUser
      ));
    } catch (error) {
      next(error);
    }
  }

  static async deleteAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id;

      await UserService.deleteUser(userId);

      res.status(200).json(formatResponse(
        'Account deleted successfully'
      ));
    } catch (error) {
      next(error);
    }
  }
}
