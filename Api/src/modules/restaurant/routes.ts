import { Router } from 'express';
import { RestaurantController } from './controllers/restaurant.controller';
import { authenticate, isRestaurant, isRestaurantOrAdmin } from '../shared/middlewares/auth.middleware';
import { validate } from '../shared/middlewares/validation.middleware';
import { createMealValidation, updateMealValidation } from './dto/restaurant.dto';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Meal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Meal ID
 *         name:
 *           type: string
 *           description: Meal name
 *         description:
 *           type: string
 *           description: Meal description
 *         price:
 *           type: number
 *           description: Meal price
 *         category:
 *           type: string
 *           enum: [appetizer, main, dessert, beverage, salad, soup, side]
 *           description: Meal category
 *         image:
 *           type: string
 *           description: Meal image URL
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients
 *         isAvailable:
 *           type: boolean
 *           description: Meal availability status
 *         restaurantId:
 *           type: string
 *           description: Restaurant ID
 *         preparationTime:
 *           type: number
 *           description: Preparation time in minutes
 *         calories:
 *           type: number
 *           description: Calorie count
 *         allergens:
 *           type: array
 *           items:
 *             type: string
 *             enum: [gluten, dairy, nuts, eggs, soy, shellfish, fish]
 *           description: List of allergens
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Meal tags
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// Public routes (accessible by all authenticated users)
/**
 * @swagger
 * /api/v1/restaurant/search:
 *   get:
 *     summary: Search meals across all restaurants
 *     tags: [Restaurant - Public]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of meals per page
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meal'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Search query is required
 *       401:
 *         description: Unauthorized
 */
router.get('/search', authenticate, RestaurantController.searchMeals);

/**
 * @swagger
 * /api/v1/restaurant/category/{category}:
 *   get:
 *     summary: Get meals by category
 *     tags: [Restaurant - Public]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [appetizer, main, dessert, beverage, salad, soup, side]
 *         description: Meal category
 *     responses:
 *       200:
 *         description: Meals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meal'
 *       401:
 *         description: Unauthorized
 */
router.get('/category/:category', authenticate, RestaurantController.getMealsByCategory);

// Restaurant-only routes
/**
 * @swagger
 * /api/v1/restaurant/meals:
 *   post:
 *     summary: Create a new meal
 *     tags: [Restaurant - Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - ingredients
 *               - preparationTime
 *             properties:
 *               name:
 *                 type: string
 *                 example: Margherita Pizza
 *               description:
 *                 type: string
 *                 example: Classic pizza with tomato sauce, mozzarella, and fresh basil
 *               price:
 *                 type: number
 *                 example: 12.99
 *               category:
 *                 type: string
 *                 enum: [appetizer, main, dessert, beverage, salad, soup, side]
 *                 example: main
 *               image:
 *                 type: string
 *                 example: https://example.com/pizza.jpg
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["tomato sauce", "mozzarella cheese", "fresh basil", "pizza dough"]
 *               preparationTime:
 *                 type: number
 *                 example: 15
 *               calories:
 *                 type: number
 *                 example: 250
 *               allergens:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [gluten, dairy, nuts, eggs, soy, shellfish, fish]
 *                 example: ["gluten", "dairy"]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["vegetarian", "italian", "popular"]
 *     responses:
 *       201:
 *         description: Meal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Meal'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Restaurant role required
 */
router.post('/meals', authenticate, isRestaurant, validate(createMealValidation), RestaurantController.createMeal);

/**
 * @swagger
 * /api/v1/restaurant/meals:
 *   get:
 *     summary: Get all meals for the authenticated restaurant
 *     tags: [Restaurant - Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of meals per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [appetizer, main, dessert, beverage, salad, soup, side]
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in meal name and description
 *     responses:
 *       200:
 *         description: Meals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meal'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Restaurant role required
 */
router.get('/meals', authenticate, isRestaurant, RestaurantController.getMeals);

/**
 * @swagger
 * /api/v1/restaurant/meals/{id}:
 *   get:
 *     summary: Get a specific meal by ID
 *     tags: [Restaurant - Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meal ID
 *     responses:
 *       200:
 *         description: Meal retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Meal'
 *       404:
 *         description: Meal not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Restaurant role required
 */
router.get('/meals/:id', authenticate, isRestaurant, RestaurantController.getMealById);

/**
 * @swagger
 * /api/v1/restaurant/meals/{id}:
 *   patch:
 *     summary: Update a meal
 *     tags: [Restaurant - Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [appetizer, main, dessert, beverage, salad, soup, side]
 *               image:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               isAvailable:
 *                 type: boolean
 *               preparationTime:
 *                 type: number
 *               calories:
 *                 type: number
 *               allergens:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [gluten, dairy, nuts, eggs, soy, shellfish, fish]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Meal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Meal'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Meal not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Restaurant role required
 */
router.patch('/meals/:id', authenticate, isRestaurant, validate(updateMealValidation), RestaurantController.updateMeal);

/**
 * @swagger
 * /api/v1/restaurant/meals/{id}:
 *   delete:
 *     summary: Delete a meal
 *     tags: [Restaurant - Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meal ID
 *     responses:
 *       200:
 *         description: Meal deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Meal not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Restaurant role required
 */
router.delete('/meals/:id', authenticate, isRestaurant, RestaurantController.deleteMeal);

/**
 * @swagger
 * /api/v1/restaurant/meals/{id}/toggle-availability:
 *   patch:
 *     summary: Toggle meal availability
 *     tags: [Restaurant - Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meal ID
 *     responses:
 *       200:
 *         description: Meal availability updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Meal'
 *       404:
 *         description: Meal not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Restaurant role required
 */
router.patch('/meals/:id/toggle-availability', authenticate, isRestaurant, RestaurantController.toggleMealAvailability);

export default router;
