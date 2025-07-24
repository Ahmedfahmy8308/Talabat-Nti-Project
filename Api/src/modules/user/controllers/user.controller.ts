import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../../shared/middlewares/error.middleware';
import { Helpers } from '../../shared/utils/helpers';
import { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get current user profile
   */
  getProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      const profile = await this.userService.getProfile(req.user._id);

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            'Profile retrieved successfully',
            profile,
          ),
        );
    },
  );

  /**
   * Update user profile
   */
  updateProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      let updatedProfile;

      switch (req.user.role) {
        case 'restaurant':
          updatedProfile = await this.userService.updateRestaurantProfile(
            req.user._id,
            req.body,
          );
          break;
        case 'delivery':
          updatedProfile = await this.userService.updateDeliveryProfile(
            req.user._id,
            req.body,
          );
          break;
        default:
          updatedProfile = await this.userService.updateProfile(
            req.user._id,
            req.body,
          );
      }

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            'Profile updated successfully',
            updatedProfile,
          ),
        );
    },
  );

  /**
   * Add restaurant to favorites (customers only)
   */
  addToFavorites = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      await this.userService.addToFavorites(req.user._id, req.body);

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            'Restaurant added to favorites successfully',
          ),
        );
    },
  );

  /**
   * Remove restaurant from favorites
   */
  removeFromFavorites = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      const { restaurantId } = req.params;
      await this.userService.removeFromFavorites(req.user._id, restaurantId);

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            'Restaurant removed from favorites successfully',
          ),
        );
    },
  );

  /**
   * Get favorite restaurants
   */
  getFavoriteRestaurants = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      const favorites = await this.userService.getFavoriteRestaurants(
        req.user._id,
      );

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            'Favorite restaurants retrieved successfully',
            favorites,
          ),
        );
    },
  );

  /**
   * Update location (delivery users only)
   */
  updateLocation = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      await this.userService.updateLocation(req.user._id, req.body);

      res
        .status(200)
        .json(Helpers.formatResponse(true, 'Location updated successfully'));
    },
  );

  /**
   * Go online (delivery users only)
   */
  goOnline = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      await this.userService.goOnline(req.user._id);

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            'You are now online and available for deliveries',
          ),
        );
    },
  );

  /**
   * Go offline (delivery users only)
   */
  goOffline = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      await this.userService.goOffline(req.user._id);

      res.status(200).json(Helpers.formatResponse(true, 'You are now offline'));
    },
  );

  /**
   * Toggle restaurant operational status
   */
  toggleRestaurantStatus = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      const restaurant = await this.userService.toggleRestaurantStatus(
        req.user._id,
      );

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            `Restaurant is now ${restaurant.isOperational ? 'operational' : 'closed'}`,
            { isOperational: restaurant.isOperational },
          ),
        );
    },
  );

  /**
   * Get order history
   */
  getOrderHistory = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const orders = await this.userService.getOrderHistory(
        req.user._id,
        page,
        limit,
      );

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            'Order history retrieved successfully',
            orders,
          ),
        );
    },
  );

  /**
   * Get all restaurants
   */
  getRestaurants = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const restaurants = await this.userService.getUsersByRole(
        'restaurant',
        req.query,
      );

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            'Restaurants retrieved successfully',
            restaurants,
          ),
        );
    },
  );

  /**
   * Get available delivery users
   */
  getDeliveryUsers = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const deliveryUsers = await this.userService.getUsersByRole(
        'delivery',
        req.query,
      );

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            'Delivery users retrieved successfully',
            deliveryUsers,
          ),
        );
    },
  );

  /**
   * Get user by ID (public info only)
   */
  getUserById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { userId } = req.params;
      const user = await this.userService.getProfile(userId);

      // Return only public information
      const publicInfo = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
        // Role-specific public info
        ...(user.role === 'restaurant' && {
          restaurantDetails: user.restaurantDetails,
          ratings: user.ratings,
          isOperational: user.isOperational,
        }),
        ...(user.role === 'delivery' && {
          ratings: user.ratings,
          isOnline: user.isOnline,
          isAvailable: user.isAvailable,
        }),
      };

      res
        .status(200)
        .json(
          Helpers.formatResponse(
            true,
            'User information retrieved successfully',
            publicInfo,
          ),
        );
    },
  );
}
