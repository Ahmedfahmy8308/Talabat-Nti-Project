import { Response, NextFunction } from 'express';
import { UserService } from './service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { formatResponse } from '../../utils/helpers';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;

      res.status(200).json(formatResponse(
        true,
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
        true,
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
        true,
        'Account deleted successfully'
      ));
    } catch (error) {
      next(error);
    }
  }
}
