import { Response, NextFunction } from 'express';
import { RestaurantService } from '../services/restaurant.service';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';
import { formatResponse, calculatePagination } from '../../shared/utils/helpers';

export class RestaurantController {
  static async createMeal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurantId = req.user!._id;
      const mealData = req.body;

      const meal = await RestaurantService.createMeal(restaurantId, mealData);

      res.status(201).json(formatResponse(
        true,
        'Meal created successfully',
        meal
      ));
    } catch (error) {
      next(error);
    }
  }

  static async getMeals(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurantId = req.user!._id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const search = req.query.search as string;

      const { meals, total } = await RestaurantService.getMealsByRestaurant(
        restaurantId,
        page,
        limit,
        category,
        search
      );

      const pagination = calculatePagination(page, limit, total);

      res.status(200).json(formatResponse(
        true,
        'Meals retrieved successfully',
        meals,
        pagination
      ));
    } catch (error) {
      next(error);
    }
  }

  static async getMealById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurantId = req.user!._id;
      const { id } = req.params;

      const meal = await RestaurantService.getMealById(id, restaurantId);

      res.status(200).json(formatResponse(
        true,
        'Meal retrieved successfully',
        meal
      ));
    } catch (error) {
      next(error);
    }
  }

  static async updateMeal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurantId = req.user!._id;
      const { id } = req.params;
      const updateData = req.body;

      const meal = await RestaurantService.updateMeal(id, restaurantId, updateData);

      res.status(200).json(formatResponse(
        true,
        'Meal updated successfully',
        meal
      ));
    } catch (error) {
      next(error);
    }
  }

  static async deleteMeal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurantId = req.user!._id;
      const { id } = req.params;

      await RestaurantService.deleteMeal(id, restaurantId);

      res.status(200).json(formatResponse(
        true,
        'Meal deleted successfully'
      ));
    } catch (error) {
      next(error);
    }
  }

  static async toggleMealAvailability(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurantId = req.user!._id;
      const { id } = req.params;

      const meal = await RestaurantService.toggleMealAvailability(id, restaurantId);

      res.status(200).json(formatResponse(
        true,
        'Meal availability updated successfully',
        meal
      ));
    } catch (error) {
      next(error);
    }
  }

  // Public endpoints (accessible by customers)
  static async searchMeals(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchQuery = req.query.q as string;

      if (!searchQuery) {
        res.status(400).json(formatResponse(
          false,
          'Search query is required'
        ));
        return;
      }

      const { meals, total } = await RestaurantService.searchMeals(searchQuery, page, limit);
      const pagination = calculatePagination(page, limit, total);

      res.status(200).json(formatResponse(
        true,
        'Search results retrieved successfully',
        meals,
        pagination
      ));
    } catch (error) {
      next(error);
    }
  }

  static async getMealsByCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.params;
      const meals = await RestaurantService.getMealsByCategory(category);

      res.status(200).json(formatResponse(
        true,
        'Meals retrieved successfully',
        meals
      ));
    } catch (error) {
      next(error);
    }
  }
}
