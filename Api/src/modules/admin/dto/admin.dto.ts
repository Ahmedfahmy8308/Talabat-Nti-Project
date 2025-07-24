import { body, query, param } from 'express-validator';

// Admin profile update validation
export const updateAdminProfileValidation = [
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
    .withMessage('Please provide a valid phone number')
];

// User management validation
export const createUserValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('role')
    .isIn(['admin', 'customer', 'restaurant', 'delivery'])
    .withMessage('Role must be one of: admin, customer, restaurant, delivery'),

  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'banned'])
    .withMessage('Status must be active, inactive, or banned')
];

export const updateUserRoleValidation = [
  body('role')
    .isIn(['admin', 'customer', 'restaurant', 'delivery'])
    .withMessage('Role must be one of: admin, customer, restaurant, delivery')
];

// Restaurant approval validation
export const restaurantApprovalValidation = [
  param('restaurantId')
    .isMongoId()
    .withMessage('Please provide a valid restaurant ID'),

  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be approved or rejected'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

// User status update validation
export const updateUserStatusValidation = [
  param('userId')
    .isMongoId()
    .withMessage('Please provide a valid user ID'),

  body('status')
    .isIn(['active', 'inactive', 'banned', 'suspended'])
    .withMessage('Status must be active, inactive, banned, or suspended'),

  body('reason')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Reason must be between 5 and 500 characters'),

  body('suspensionEndDate')
    .optional()
    .isISO8601()
    .withMessage('Suspension end date must be a valid ISO date')
];

// Analytics query validation
export const analyticsQueryValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),

  query('groupBy')
    .optional()
    .isIn(['day', 'week', 'month', 'quarter', 'year'])
    .withMessage('Group by must be day, week, month, quarter, or year'),

  query('type')
    .optional()
    .isIn(['orders', 'revenue', 'users', 'restaurants', 'deliveries'])
    .withMessage('Type must be orders, revenue, users, restaurants, or deliveries'),

  query('restaurantId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid restaurant ID')
];

// System settings validation
export const updateSystemSettingsValidation = [
  body('settings.deliveryFee.base')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Base delivery fee must be between 0 and 50'),

  body('settings.deliveryFee.perKm')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Per km delivery fee must be between 0 and 10'),

  body('settings.commission.restaurantRate')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Restaurant commission rate must be between 0 and 50 percent'),

  body('settings.commission.deliveryRate')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Delivery commission rate must be between 0 and 50 percent'),

  body('settings.orderLimits.minAmount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Minimum order amount must be between 0 and 100'),

  body('settings.orderLimits.maxAmount')
    .optional()
    .isFloat({ min: 100, max: 10000 })
    .withMessage('Maximum order amount must be between 100 and 10000'),

  body('settings.businessHours.start')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid start time format (HH:mm)'),

  body('settings.businessHours.end')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid end time format (HH:mm)'),

  body('settings.maintenance.enabled')
    .optional()
    .isBoolean()
    .withMessage('Maintenance enabled must be a boolean value'),

  body('settings.maintenance.message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Maintenance message cannot exceed 500 characters')
];

// Promo code management validation
export const createPromoCodeValidation = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Promo code must be between 3 and 20 characters')
    .isAlphanumeric()
    .withMessage('Promo code must contain only letters and numbers')
    .toUpperCase(),

  body('description')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Description must be between 10 and 200 characters'),

  body('type')
    .isIn(['percentage', 'fixed'])
    .withMessage('Type must be percentage or fixed'),

  body('value')
    .isFloat({ min: 0.01 })
    .withMessage('Value must be greater than 0'),

  body('minOrderAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum order amount must be 0 or greater'),

  body('maxDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount must be 0 or greater'),

  body('usageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be at least 1'),

  body('userUsageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('User usage limit must be at least 1'),

  body('validFrom')
    .isISO8601()
    .withMessage('Valid from date must be a valid ISO date'),

  body('validUntil')
    .isISO8601()
    .withMessage('Valid until date must be a valid ISO date'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),

  body('applicableToRestaurants')
    .optional()
    .isArray()
    .withMessage('Applicable restaurants must be an array'),

  body('applicableToRestaurants.*')
    .optional()
    .isMongoId()
    .withMessage('Each restaurant ID must be valid')
];

// Parameter validations
export const userIdValidation = [
  param('userId')
    .isMongoId()
    .withMessage('Please provide a valid user ID')
];

export const restaurantIdValidation = [
  param('restaurantId')
    .isMongoId()
    .withMessage('Please provide a valid restaurant ID')
];

export const promoCodeIdValidation = [
  param('promoId')
    .isMongoId()
    .withMessage('Please provide a valid promo code ID')
];
