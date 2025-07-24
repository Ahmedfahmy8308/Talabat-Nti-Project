import { User, Customer, Restaurant, Delivery } from '../schemas';
import { AppError } from '../../shared/middlewares/error.middleware';
import {
  UpdateProfileDTO,
  UpdateRestaurantProfileDTO,
  UpdateDeliveryProfileDTO,
  AddToFavoritesDTO,
  UpdateLocationDTO,
} from '../dto/user.dto';

export class UserService {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updateData: UpdateProfileDTO,
  ): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update common fields
    if (updateData.firstName) user.firstName = updateData.firstName;
    if (updateData.lastName) user.lastName = updateData.lastName;
    if (updateData.phone) user.phone = updateData.phone;
    if (updateData.address) user.address = updateData.address;

    await user.save();
    return user;
  }

  /**
   * Update restaurant profile
   */
  async updateRestaurantProfile(
    userId: string,
    updateData: UpdateRestaurantProfileDTO,
  ): Promise<any> {
    const restaurant = await Restaurant.findById(userId);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }

    // Update common fields
    if (updateData.firstName) restaurant.firstName = updateData.firstName;
    if (updateData.lastName) restaurant.lastName = updateData.lastName;
    if (updateData.phone) restaurant.phone = updateData.phone;
    if (updateData.address) restaurant.address = updateData.address;

    // Update restaurant specific fields
    if (updateData.restaurantDetails) {
      restaurant.restaurantDetails = {
        ...restaurant.restaurantDetails,
        ...updateData.restaurantDetails,
      };
    }

    if (updateData.businessInfo) {
      restaurant.businessInfo = {
        ...restaurant.businessInfo,
        ...updateData.businessInfo,
      };
    }

    await restaurant.save();
    return restaurant;
  }

  /**
   * Update delivery profile
   */
  async updateDeliveryProfile(
    userId: string,
    updateData: UpdateDeliveryProfileDTO,
  ): Promise<any> {
    const delivery = await Delivery.findById(userId);
    if (!delivery) {
      throw new AppError('Delivery user not found', 404);
    }

    // Update common fields
    if (updateData.firstName) delivery.firstName = updateData.firstName;
    if (updateData.lastName) delivery.lastName = updateData.lastName;
    if (updateData.phone) delivery.phone = updateData.phone;
    if (updateData.address) delivery.address = updateData.address;

    // Update delivery specific fields
    if (updateData.vehicleInfo) {
      delivery.vehicleInfo = {
        ...delivery.vehicleInfo,
        ...updateData.vehicleInfo,
      };
    }

    if (updateData.workingHours) {
      delivery.workingHours = {
        ...delivery.workingHours,
        ...updateData.workingHours,
      };
    }

    if (updateData.deliveryZones) {
      delivery.deliveryZones = updateData.deliveryZones;
    }

    await delivery.save();
    return delivery;
  }

  /**
   * Add restaurant to favorites (customers only)
   */
  async addToFavorites(
    userId: string,
    favoriteData: AddToFavoritesDTO,
  ): Promise<void> {
    const customer = await Customer.findById(userId);
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(favoriteData.restaurantId);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }

    await (customer as any).addToFavorites(favoriteData.restaurantId);
  }

  /**
   * Remove restaurant from favorites
   */
  async removeFromFavorites(
    userId: string,
    restaurantId: string,
  ): Promise<void> {
    const customer = await Customer.findById(userId);
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    await (customer as any).removeFromFavorites(restaurantId);
  }

  /**
   * Get user's favorite restaurants
   */
  async getFavoriteRestaurants(userId: string): Promise<any[]> {
    const customer = await Customer.findById(userId).populate(
      'favoriteRestaurants',
    );
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return customer.favoriteRestaurants || [];
  }

  /**
   * Update delivery person location
   */
  async updateLocation(
    userId: string,
    locationData: UpdateLocationDTO,
  ): Promise<void> {
    const delivery = await Delivery.findById(userId);
    if (!delivery) {
      throw new AppError('Delivery user not found', 404);
    }

    await (delivery as any).updateLocation(locationData.lat, locationData.lng);
  }

  /**
   * Go online (delivery users only)
   */
  async goOnline(userId: string): Promise<void> {
    const delivery = await Delivery.findById(userId);
    if (!delivery) {
      throw new AppError('Delivery user not found', 404);
    }

    await (delivery as any).goOnline();
  }

  /**
   * Go offline (delivery users only)
   */
  async goOffline(userId: string): Promise<void> {
    const delivery = await Delivery.findById(userId);
    if (!delivery) {
      throw new AppError('Delivery user not found', 404);
    }

    await (delivery as any).goOffline();
  }

  /**
   * Toggle restaurant operational status
   */
  async toggleRestaurantStatus(userId: string): Promise<any> {
    const restaurant = await Restaurant.findById(userId);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }

    await (restaurant as any).toggleOperationalStatus();
    return restaurant;
  }

  /**
   * Get user's order history
   */
  async getOrderHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Import Order here to avoid circular dependency
    const Order = require('../../order/schemas/order.schema').default;

    let orders = [];

    switch (user.role) {
      case 'customer':
        orders = await Order.findByCustomer(userId, { page, limit });
        break;
      case 'restaurant':
        orders = await Order.findByRestaurant(userId, { page, limit });
        break;
      case 'delivery':
        orders = await Order.findByDeliveryPerson(userId, { page, limit });
        break;
    }

    return orders;
  }

  /**
   * Get users by role with filtering
   */
  async getUsersByRole(role: string, filters: any = {}): Promise<any[]> {
    const query: any = { role, isActive: true };

    if (role === 'restaurant') {
      query.verificationStatus = 'verified';
      query.isOperational = true;
    }

    if (role === 'delivery') {
      query.verificationStatus = 'verified';
      if (filters.isOnline) {
        query.isOnline = true;
      }
    }

    // Location-based filtering for restaurants and delivery
    if (filters.coordinates && (role === 'restaurant' || role === 'delivery')) {
      const { lat, lng, maxDistance = 5000 } = filters.coordinates;

      const users = await User.find({
        ...query,
        'address.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: maxDistance,
          },
        },
      });

      return users;
    }

    return await User.find(query).sort({ createdAt: -1 });
  }
}
