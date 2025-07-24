import { Router } from 'express';
import { DeliveryController } from './controllers/delivery.controller';
import { authenticate, isDelivery, isDeliveryOrAdmin } from '../shared/middlewares/auth.middleware';
import { validate } from '../shared/middlewares/validation.middleware';
import { updateDeliveryStatusValidation } from './dto/delivery.dto';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Order ID
 *         customerId:
 *           type: string
 *           description: Customer ID
 *         restaurantId:
 *           type: string
 *           description: Restaurant ID
 *         deliveryPersonId:
 *           type: string
 *           description: Delivery person ID
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               mealId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *               specialInstructions:
 *                 type: string
 *         status:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, picked_up, delivered, cancelled]
 *         deliveryAddress:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *             coordinates:
 *               type: object
 *               properties:
 *                 lat:
 *                   type: number
 *                 lng:
 *                   type: number
 *             instructions:
 *               type: string
 *         customerInfo:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             phone:
 *               type: string
 *         totalAmount:
 *           type: number
 *         deliveryFee:
 *           type: number
 *         tax:
 *           type: number
 *         finalAmount:
 *           type: number
 *         paymentMethod:
 *           type: string
 *           enum: [cash, card, digital_wallet]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed, refunded]
 *         estimatedDeliveryTime:
 *           type: string
 *           format: date-time
 *         actualDeliveryTime:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *         limit:
 *           type: number
 *         total:
 *           type: number
 *         pages:
 *           type: number
 */

// All delivery routes require authentication and delivery role
router.use(authenticate, isDelivery);

/**
 * @swagger
 * /api/v1/delivery/available-orders:
 *   get:
 *     summary: Get available orders for delivery
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Delivery person latitude
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Delivery person longitude
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 10
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: Available orders retrieved successfully
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
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Delivery role required
 */
router.get('/available-orders', DeliveryController.getAvailableOrders);

/**
 * @swagger
 * /api/v1/delivery/orders/{orderId}/accept:
 *   post:
 *     summary: Accept an available order
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order accepted successfully
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
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found or already assigned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Delivery role required
 */
router.post('/orders/:orderId/accept', DeliveryController.acceptOrder);

/**
 * @swagger
 * /api/v1/delivery/my-deliveries:
 *   get:
 *     summary: Get my assigned deliveries
 *     tags: [Delivery]
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
 *         description: Number of orders per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [picked_up, delivered]
 *         description: Filter by delivery status
 *     responses:
 *       200:
 *         description: Deliveries retrieved successfully
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
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Delivery role required
 */
router.get('/my-deliveries', DeliveryController.getMyDeliveries);

/**
 * @swagger
 * /api/v1/delivery/orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
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
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Delivery role required
 */
router.get('/orders/:orderId', DeliveryController.getOrderById);

/**
 * @swagger
 * /api/v1/delivery/orders/{orderId}/status:
 *   patch:
 *     summary: Update delivery status
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
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
 *                 enum: [picked_up, delivered]
 *                 example: delivered
 *     responses:
 *       200:
 *         description: Delivery status updated successfully
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
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found or not assigned to you
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Delivery role required
 */
router.patch('/orders/:orderId/status', validate(updateDeliveryStatusValidation), DeliveryController.updateDeliveryStatus);

/**
 * @swagger
 * /api/v1/delivery/stats:
 *   get:
 *     summary: Get delivery statistics
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
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
 *                   type: object
 *                   properties:
 *                     totalDeliveries:
 *                       type: number
 *                     todayDeliveries:
 *                       type: number
 *                     weekDeliveries:
 *                       type: number
 *                     averageRating:
 *                       type: number
 *                     totalEarnings:
 *                       type: number
 *                     activeOrders:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Delivery role required
 */
router.get('/stats', DeliveryController.getDeliveryStats);

export default router;
