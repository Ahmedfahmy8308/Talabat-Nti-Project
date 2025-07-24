import { body, query, param } from 'express-validator';

// Delivery profile update validation
export const updateDeliveryProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  body('vehicleType')
    .optional()
    .isIn(['bike', 'motorcycle', 'car'])
    .withMessage('Vehicle type must be bike, motorcycle, or car'),

  body('vehicleDetails.make')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Vehicle make must be between 2 and 50 characters'),

  body('vehicleDetails.model')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Vehicle model must be between 2 and 50 characters'),

  body('vehicleDetails.year')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Vehicle year must be valid'),

  body('vehicleDetails.licensePlate')
    .optional()
    .trim()
    .matches(/^[A-Z0-9-]{3,10}$/)
    .withMessage('License plate format is invalid')
];

// Order assignment validation
export const assignOrderValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Please provide a valid order ID'),

  body('deliveryPersonId')
    .isMongoId()
    .withMessage('Please provide a valid delivery person ID'),

  body('estimatedDeliveryTime')
    .optional()
    .isInt({ min: 10, max: 120 })
    .withMessage('Estimated delivery time must be between 10 and 120 minutes')
];

export const updateDeliveryStatusValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Please provide a valid order ID'),

  body('status')
    .isIn(['assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'])
    .withMessage('Status must be assigned, picked_up, in_transit, delivered, or cancelled'),

  body('location.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('location.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

// Delivery availability validation
export const updateAvailabilityValidation = [
  body('isAvailable')
    .isBoolean()
    .withMessage('isAvailable must be a boolean value'),

  body('location.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('location.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

// Delivery earnings validation
export const earningsQueryValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Delivery query validation
export const deliveryQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters'),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Status must be active, inactive, or suspended'),

  query('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean value'),

  query('vehicleType')
    .optional()
    .isIn(['bike', 'motorcycle', 'car'])
    .withMessage('Vehicle type must be bike, motorcycle, or car'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'firstName', 'lastName', 'rating', 'totalDeliveries'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  query('restaurantId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid restaurant ID')
];

// Order tracking validation
export const orderTrackingValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Please provide a valid order ID')
];

// Delivery performance validation
export const performanceQueryValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),

  query('deliveryPersonId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid delivery person ID')
];

// Batch delivery operations
export const batchAssignOrdersValidation = [
  body('orderIds')
    .isArray({ min: 1, max: 20 })
    .withMessage('At least 1 and at most 20 order IDs are required'),

  body('orderIds.*')
    .isMongoId()
    .withMessage('Each order ID must be valid'),

  body('deliveryPersonId')
    .isMongoId()
    .withMessage('Please provide a valid delivery person ID')
];

// Rating validation
export const rateDeliveryValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Please provide a valid order ID'),

  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

// Parameter validations
export const deliveryPersonIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid delivery person ID')
];

export const orderIdValidation = [
  param('orderId')
    .isMongoId()
    .withMessage('Please provide a valid order ID')
];
