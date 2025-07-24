import { body, query, param } from 'express-validator';

// Order creation validation
export const createOrderValidation = [
  body('restaurantId')
    .isMongoId()
    .withMessage('Please provide a valid restaurant ID'),

  body('items')
    .isArray({ min: 1, max: 50 })
    .withMessage('Order must contain at least 1 and at most 50 items'),

  body('items.*.mealId')
    .isMongoId()
    .withMessage('Each item must have a valid meal ID'),

  body('items.*.quantity')
    .isInt({ min: 1, max: 20 })
    .withMessage('Quantity must be between 1 and 20'),

  body('items.*.price')
    .isFloat({ min: 0.01, max: 1000 })
    .withMessage('Item price must be between 0.01 and 1000'),

  body('items.*.customizations')
    .optional()
    .isArray({ max: 10 })
    .withMessage('At most 10 customizations per item'),

  body('items.*.customizations.*.name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Customization name must be between 1 and 100 characters'),

  body('items.*.customizations.*.value')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Customization value must be between 1 and 100 characters'),

  body('items.*.customizations.*.priceModifier')
    .optional()
    .isFloat({ min: -50, max: 50 })
    .withMessage('Price modifier must be between -50 and 50'),

  body('deliveryAddress.street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),

  body('deliveryAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),

  body('deliveryAddress.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),

  body('deliveryAddress.zipCode')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('Zip code must be between 5 and 10 characters'),

  body('deliveryAddress.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('deliveryAddress.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  body('paymentMethod')
    .isIn(['cash', 'card', 'digital_wallet'])
    .withMessage('Payment method must be cash, card, or digital_wallet'),

  body('specialInstructions')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special instructions cannot exceed 500 characters'),

  body('scheduledDeliveryTime')
    .optional()
    .isISO8601()
    .withMessage('Scheduled delivery time must be a valid ISO date'),

  body('promoCode')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Promo code must be between 3 and 20 characters')
    .isAlphanumeric()
    .withMessage('Promo code must contain only letters and numbers')
];

// Order update validation (for restaurant/admin use)
export const updateOrderStatusValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Please provide a valid order ID'),

  body('status')
    .isIn(['confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'])
    .withMessage('Status must be confirmed, preparing, ready, picked_up, delivered, or cancelled'),

  body('estimatedPreparationTime')
    .optional()
    .isInt({ min: 5, max: 120 })
    .withMessage('Estimated preparation time must be between 5 and 120 minutes'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reason cannot exceed 200 characters')
];

// Order cancellation validation
export const cancelOrderValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Please provide a valid order ID'),

  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Cancellation reason must be between 10 and 500 characters'),

  body('refundAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Refund amount must be 0 or greater')
];

// Order rating validation
export const rateOrderValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Please provide a valid order ID'),

  body('restaurantRating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Restaurant rating must be between 1 and 5'),

  body('deliveryRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Delivery rating must be between 1 and 5'),

  body('foodQuality')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Food quality rating must be between 1 and 5'),

  body('restaurantComment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Restaurant comment cannot exceed 500 characters'),

  body('deliveryComment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Delivery comment cannot exceed 500 characters')
];

// Order query validation
export const orderQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),

  query('restaurantId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid restaurant ID'),

  query('customerId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid customer ID'),

  query('deliveryPersonId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid delivery person ID'),

  query('minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum amount must be 0 or greater'),

  query('maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum amount must be 0 or greater'),

  query('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'digital_wallet'])
    .withMessage('Payment method must be cash, card, or digital_wallet'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'totalAmount', 'status'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Reorder validation
export const reorderValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Please provide a valid order ID'),

  body('deliveryAddress')
    .optional()
    .isObject()
    .withMessage('Delivery address must be an object'),

  body('deliveryAddress.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),

  body('deliveryAddress.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),

  body('deliveryAddress.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),

  body('deliveryAddress.zipCode')
    .optional()
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('Zip code must be between 5 and 10 characters'),

  body('deliveryAddress.coordinates.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('deliveryAddress.coordinates.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

// Bulk order operations validation
export const bulkUpdateOrdersValidation = [
  body('orderIds')
    .isArray({ min: 1, max: 50 })
    .withMessage('At least 1 and at most 50 order IDs are required'),

  body('orderIds.*')
    .isMongoId()
    .withMessage('Each order ID must be valid'),

  body('status')
    .isIn(['confirmed', 'preparing', 'ready', 'cancelled'])
    .withMessage('Status must be confirmed, preparing, ready, or cancelled'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reason cannot exceed 200 characters')
];

// Order analytics validation
export const orderAnalyticsValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),

  query('restaurantId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid restaurant ID'),

  query('groupBy')
    .optional()
    .isIn(['day', 'week', 'month', 'year'])
    .withMessage('Group by must be day, week, month, or year')
];

// Promo code validation
export const applyPromoCodeValidation = [
  body('promoCode')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Promo code must be between 3 and 20 characters')
    .isAlphanumeric()
    .withMessage('Promo code must contain only letters and numbers'),

  body('orderTotal')
    .isFloat({ min: 0.01 })
    .withMessage('Order total must be greater than 0')
];

// Parameter validations
export const orderIdValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Please provide a valid order ID')
];

export const customerIdValidation = [
  param('customerId')
    .isMongoId()
    .withMessage('Please provide a valid customer ID')
];

export const restaurantIdValidation = [
  param('restaurantId')
    .isMongoId()
    .withMessage('Please provide a valid restaurant ID')
];
