import { Response } from 'express';
import { validationResult } from 'express-validator';
import { RestaurantService } from '../services/restaurant.service';
import { AppError } from '../../shared/middlewares/error.middleware';
import { Helpers } from '../../shared/utils/helpers';
import { asyncHandler } from '../../shared/middlewares/error.middleware';
import { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';

const restaurantService = new RestaurantService();

export class RestaurantController {
  /**
   * Create a new meal
   */
  createMeal = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400);
      }

      const restaurantId = req.user!.id;
      const meal = await restaurantService.createMeal(restaurantId, req.body);

      res
        .status(201)
        .json(Helpers.formatResponse(true, 'Meal created successfully', meal));
    },
  );

  /**
   * Update meal
   */
  updateMeal = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400);
      }

      const restaurantId = req.user!.id;
      const { mealId } = req.params;
      const meal = await restaurantService.updateMeal(
        restaurantId,
        mealId,
        req.body,
      );

      res.json(Helpers.formatResponse(true, 'Meal updated successfully', meal));
    },
  );

  /**
   * Delete meal
   */
  deleteMeal = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const restaurantId = req.user!.id;
      const { mealId } = req.params;
      await restaurantService.deleteMeal(restaurantId, mealId);

      res.json(Helpers.formatResponse(true, 'Meal deleted successfully'));
    },
  );

  /**
   * Get restaurant's meals
   */
  getMyMeals = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const restaurantId = req.user!.id;
      const meals = await restaurantService.getRestaurantMeals(
        restaurantId,
        req.query,
      );

      res.json(
        Helpers.formatResponse(true, 'Meals retrieved successfully', meals),
      );
    },
  );

  /**
   * Search meals (public)
   */
  searchMeals = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await restaurantService.searchMeals(req.query);

      res.json(
        Helpers.formatResponse(true, 'Meals searched successfully', result),
      );
    },
  );

  /**
   * Get meal by ID (public)
   */
  getMealById = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { mealId } = req.params;
      const meal = await restaurantService.getMealById(mealId);

      res.json(
        Helpers.formatResponse(true, 'Meal retrieved successfully', meal),
      );
    },
  );

  /**
   * Get meals by category (public)
   */
  getMealsByCategory = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { category } = req.params;
      const meals = await restaurantService.getMealsByCategory(category);

      res.json(
        Helpers.formatResponse(true, 'Meals retrieved successfully', meals),
      );
    },
  );

  /**
   * Get featured meals (public)
   */
  getFeaturedMeals = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const meals = await restaurantService.getFeaturedMeals(limit);

      res.json(
        Helpers.formatResponse(
          true,
          'Featured meals retrieved successfully',
          meals,
        ),
      );
    },
  );

  /**
   * Toggle meal availability
   */
  toggleMealAvailability = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const restaurantId = req.user!.id;
      const { mealId } = req.params;
      const meal = await restaurantService.toggleMealAvailability(
        restaurantId,
        mealId,
      );

      res.json(
        Helpers.formatResponse(
          true,
          'Meal availability updated successfully',
          meal,
        ),
      );
    },
  );

  /**
   * Set meal discount
   */
  setMealDiscount = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400);
      }

      const restaurantId = req.user!.id;
      const { mealId } = req.params;
      const meal = await restaurantService.setMealDiscount(
        restaurantId,
        mealId,
        req.body,
      );

      res.json(
        Helpers.formatResponse(true, 'Meal discount set successfully', meal),
      );
    },
  );

  /**
   * Remove meal discount
   */
  removeMealDiscount = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const restaurantId = req.user!.id;
      const { mealId } = req.params;
      const meal = await restaurantService.removeMealDiscount(
        restaurantId,
        mealId,
      );

      res.json(
        Helpers.formatResponse(
          true,
          'Meal discount removed successfully',
          meal,
        ),
      );
    },
  );

  /**
   * Get restaurant analytics
   */
  getAnalytics = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const restaurantId = req.user!.id;
      const dateRange =
        req.query.from && req.query.to
          ? {
              from: new Date(req.query.from as string),
              to: new Date(req.query.to as string),
            }
          : undefined;

      const analytics = await restaurantService.getRestaurantAnalytics(
        restaurantId,
        dateRange,
      );

      res.json(
        Helpers.formatResponse(
          true,
          'Analytics retrieved successfully',
          analytics,
        ),
      );
    },
  );
}
