import { Router } from 'express';
import { AdminController } from './controllers/admin.controller';
import { authenticate, authorize } from '../shared/middlewares/auth.middleware';
import { validateRequest } from '../shared/middlewares/validation.middleware';
import { body, param } from 'express-validator';

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users with filtering
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [customer, restaurant, delivery]
 *         description: Filter by user role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending, verified, rejected]
 *         description: Filter by user status
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
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/users', adminController.getUsers);

/**
 * @swagger
 * /api/v1/admin/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get(
  '/users/:userId',
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  adminController.getUserById,
);

/**
 * @swagger
 * /api/v1/admin/users/{userId}/approve:
 *   post:
 *     summary: Approve or reject restaurant/delivery registration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [verified, rejected]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: User approval status updated successfully
 */
router.post(
  '/users/:userId/approve',
  param('userId').isMongoId().withMessage('Invalid user ID'),
  body('status')
    .isIn(['verified', 'rejected'])
    .withMessage('Status must be verified or rejected'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  validateRequest,
  adminController.approveUser,
);

/**
 * @swagger
 * /api/v1/admin/users/{userId}/status:
 *   patch:
 *     summary: Update user active status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: User status updated successfully
 */
router.patch(
  '/users/:userId/status',
  param('userId').isMongoId().withMessage('Invalid user ID'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  validateRequest,
  adminController.updateUserStatus,
);

/**
 * @swagger
 * /api/v1/admin/users/{userId}:
 *   delete:
 *     summary: Delete user (soft delete)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete(
  '/users/:userId',
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validateRequest,
  adminController.deleteUser,
);

/**
 * @swagger
 * /api/v1/admin/pending/restaurants:
 *   get:
 *     summary: Get pending restaurant approvals
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending restaurants retrieved successfully
 */
router.get('/pending/restaurants', adminController.getPendingRestaurants);

/**
 * @swagger
 * /api/v1/admin/pending/delivery:
 *   get:
 *     summary: Get pending delivery user approvals
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending delivery users retrieved successfully
 */
router.get('/pending/delivery', adminController.getPendingDeliveryUsers);

/**
 * @swagger
 * /api/v1/admin/analytics:
 *   get:
 *     summary: Get platform analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics
 *     responses:
 *       200:
 *         description: Platform analytics retrieved successfully
 */
router.get('/analytics', adminController.getPlatformAnalytics);

export default router;
