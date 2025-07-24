import { body } from 'express-validator';
import { commonValidations } from '../../shared/middlewares/validation.middleware';

export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),

  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces')
    .trim(),

  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces')
    .trim(),

  body('role')
    .isIn(['customer', 'restaurant', 'delivery'])
    .withMessage('Role must be one of: customer, restaurant, delivery'),

  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),

  // Restaurant specific validations
  body('restaurantDetails.name')
    .if(body('role').equals('restaurant'))
    .notEmpty()
    .withMessage('Restaurant name is required')
    .isLength({ max: 100 })
    .withMessage('Restaurant name cannot exceed 100 characters'),

  body('restaurantDetails.cuisineType')
    .if(body('role').equals('restaurant'))
    .isArray({ min: 1 })
    .withMessage('At least one cuisine type is required'),

  body('restaurantDetails.averageDeliveryTime')
    .if(body('role').equals('restaurant'))
    .isInt({ min: 10, max: 120 })
    .withMessage('Average delivery time must be between 10 and 120 minutes'),

  body('businessInfo.licenseNumber')
    .if(body('role').equals('restaurant'))
    .notEmpty()
    .withMessage('Business license number is required'),

  body('businessInfo.taxId')
    .if(body('role').equals('restaurant'))
    .notEmpty()
    .withMessage('Tax ID is required'),

  // Delivery specific validations
  body('vehicleInfo.type')
    .if(body('role').equals('delivery'))
    .isIn(['bike', 'car', 'motorcycle', 'scooter'])
    .withMessage('Vehicle type must be one of: bike, car, motorcycle, scooter'),

  body('deliveryZones')
    .if(body('role').equals('delivery'))
    .isArray({ min: 1 })
    .withMessage('At least one delivery zone is required'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('password').notEmpty().withMessage('Password is required'),
];

export const verifyOTPValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),

  body('type')
    .isIn(['registration', 'password-reset'])
    .withMessage('Type must be either registration or password-reset'),
];

export const resendOTPValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('type')
    .isIn(['registration', 'password-reset'])
    .withMessage('Type must be either registration or password-reset'),
];

export const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
];

export const resetPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),

  body('newPassword')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 6, max: 128 })
    .withMessage('New password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'New password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
];
