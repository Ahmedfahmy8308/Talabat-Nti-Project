import { Router } from 'express';
import { RestaurantController } from './controllers/restaurant.controller';
import { authenticate, authorize } from '../shared/middlewares/auth.middleware';
import {
  validateCreateMeal,
  validateUpdateMeal,
  validateSearchMeals,
  validateMealDiscount,
  validateMealId,
  validateCategory,
  validateAnalyticsQuery,
} from './middlewares/restaurant.middleware';

const router = Router();
const restaurantController = new RestaurantController();

// Protected restaurant routes
router.post(
  '/meals',
  authenticate,
  authorize('restaurant'),
  validateCreateMeal,
  restaurantController.createMeal,
);

router.put(
  '/meals/:mealId',
  authenticate,
  authorize('restaurant'),
  validateUpdateMeal,
  restaurantController.updateMeal,
);

router.delete(
  '/meals/:mealId',
  authenticate,
  authorize('restaurant'),
  validateMealId,
  restaurantController.deleteMeal,
);

router.get(
  '/my-meals',
  authenticate,
  authorize('restaurant'),
  restaurantController.getMyMeals,
);

router.patch(
  '/meals/:mealId/toggle-availability',
  authenticate,
  authorize('restaurant'),
  validateMealId,
  restaurantController.toggleMealAvailability,
);

router.put(
  '/meals/:mealId/discount',
  authenticate,
  authorize('restaurant'),
  validateMealDiscount,
  restaurantController.setMealDiscount,
);

router.delete(
  '/meals/:mealId/discount',
  authenticate,
  authorize('restaurant'),
  validateMealId,
  restaurantController.removeMealDiscount,
);

router.get(
  '/analytics',
  authenticate,
  authorize('restaurant'),
  validateAnalyticsQuery,
  restaurantController.getAnalytics,
);

// Public routes (for customers browsing)
router.get(
  '/meals/search',
  validateSearchMeals,
  restaurantController.searchMeals,
);

router.get('/meals/featured', restaurantController.getFeaturedMeals);

router.get(
  '/meals/category/:category',
  validateCategory,
  restaurantController.getMealsByCategory,
);

router.get('/meals/:mealId', validateMealId, restaurantController.getMealById);

export default router;
