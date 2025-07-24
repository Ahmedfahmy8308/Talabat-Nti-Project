import { UserService } from '../user/service';
import { AppError } from '../../middlewares/error.middleware';

export class AdminService {
  static async getAllUsers(
    page: number = 1,
    limit: number = 10,
    role?: string,
    search?: string
  ) {
    return await UserService.getAllUsers(page, limit, role, search);
  }

  static async getUserById(userId: string) {
    return await UserService.getUserById(userId);
  }

  static async updateUserRole(userId: string, role: string) {
    if (!['admin', 'customer', 'restaurant', 'delivery'].includes(role)) {
      throw new AppError('Invalid role specified', 400);
    }

    return await UserService.updateUserRole(userId, role);
  }

  static async deactivateUser(userId: string) {
    return await UserService.deactivateUser(userId);
  }

  static async getDashboardStats() {
    // This would typically aggregate data from multiple collections
    // For now, we'll return basic user statistics

    const totalUsers = await UserService.getAllUsers(1, 1);
    const customerCount = await UserService.getAllUsers(1, 1, 'customer');
    const restaurantCount = await UserService.getAllUsers(1, 1, 'restaurant');
    const deliveryCount = await UserService.getAllUsers(1, 1, 'delivery');

    return {
      totalUsers: totalUsers.total,
      customers: customerCount.total,
      restaurants: restaurantCount.total,
      deliveryPersons: deliveryCount.total,
      // Additional stats can be added here
      totalOrders: 0, // Placeholder
      totalRevenue: 0, // Placeholder
      activeOrders: 0 // Placeholder
    };
  }
}
