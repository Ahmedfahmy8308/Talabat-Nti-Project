import { Request, Response, NextFunction } from 'express';
import { AdminService } from './service';
import { formatResponse, calculatePagination } from '../../utils/helpers';

export class AdminController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string;
      const search = req.query.search as string;

      const { users, total } = await AdminService.getAllUsers(page, limit, role, search);
      const pagination = calculatePagination(page, limit, total);

      res.status(200).json(formatResponse(
        true,
        'Users retrieved successfully',
        users,
        pagination
      ));
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await AdminService.getUserById(id);

      res.status(200).json(formatResponse(
        true,
        'User retrieved successfully',
        user
      ));
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await AdminService.updateUserRole(id, role);

      res.status(200).json(formatResponse(
        true,
        'User role updated successfully',
        user
      ));
    } catch (error) {
      next(error);
    }
  }

  static async deactivateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await AdminService.deactivateUser(id);

      res.status(200).json(formatResponse(
        true,
        'User deactivated successfully',
        user
      ));
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AdminService.getDashboardStats();

      res.status(200).json(formatResponse(
        true,
        'Dashboard statistics retrieved successfully',
        stats
      ));
    } catch (error) {
      next(error);
    }
  }
}
