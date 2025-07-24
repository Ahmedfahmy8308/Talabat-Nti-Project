import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import {
  authenticate,
  authorize,
  optionalAuth,
} from '../shared/middlewares/auth.middleware';
import { validateRequest } from '../shared/middlewares/validation.middleware';
import { body, param } from 'express-validator';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @swagger
 * /api/v1/users/favorites:
 *   post:
 *     summary: Add restaurant to favorites (customers only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *             properties:
 *               restaurantId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant added to favorites successfully
 */
router.post(
  '/favorites',
  authenticate,
  authorize('customer'),
  body('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
  validateRequest,
  userController.addToFavorites,
);

/**
 * @swagger
 * /api/v1/users/favorites/{restaurantId}:
 *   delete:
 *     summary: Remove restaurant from favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant removed from favorites successfully
 */
router.delete(
  '/favorites/:restaurantId',
  authenticate,
  authorize('customer'),
  param('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
  validateRequest,
  userController.removeFromFavorites,
);

/**
 * @swagger
 * /api/v1/users/favorites:
 *   get:
 *     summary: Get favorite restaurants
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorite restaurants retrieved successfully
 */
router.get(
  '/favorites',
  authenticate,
  authorize('customer'),
  userController.getFavoriteRestaurants,
);

/**
 * @swagger
 * /api/v1/users/location:
 *   patch:
 *     summary: Update location (delivery users only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lat
 *               - lng
 *             properties:
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated successfully
 */
router.patch(
  '/location',
  authenticate,
  authorize('delivery'),
  body('lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  validateRequest,
  userController.updateLocation,
);

/**
 * @swagger
 * /api/v1/users/go-online:
 *   post:
 *     summary: Go online (delivery users only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: You are now online and available for deliveries
 */
router.post(
  '/go-online',
  authenticate,
  authorize('delivery'),
  userController.goOnline,
);

/**
 * @swagger
 * /api/v1/users/go-offline:
 *   post:
 *     summary: Go offline (delivery users only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: You are now offline
 */
router.post(
  '/go-offline',
  authenticate,
  authorize('delivery'),
  userController.goOffline,
);

/**
 * @swagger
 * /api/v1/users/toggle-status:
 *   post:
 *     summary: Toggle restaurant operational status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restaurant status toggled successfully
 */
router.post(
  '/toggle-status',
  authenticate,
  authorize('restaurant'),
  userController.toggleRestaurantStatus,
);

/**
 * @swagger
 * /api/v1/users/orders:
 *   get:
 *     summary: Get order history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
 */
router.get('/orders', authenticate, userController.getOrderHistory);

/**
 * @swagger
 * /api/v1/users/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude for location-based search
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Longitude for location-based search
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *           default: 5000
 *         description: Maximum distance in meters
 *     responses:
 *       200:
 *         description: Restaurants retrieved successfully
 */
router.get('/restaurants', optionalAuth, userController.getRestaurants);

/**
 * @swagger
 * /api/v1/users/delivery:
 *   get:
 *     summary: Get available delivery users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Delivery users retrieved successfully
 */
router.get('/delivery', userController.getDeliveryUsers);

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get user by ID (public info only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       404:
 *         description: User not found
 */
router.get(
  '/:userId',
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  userController.getUserById,
);

export default router;
