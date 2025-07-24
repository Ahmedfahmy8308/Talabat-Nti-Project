import { body, query, param } from 'express-validator';

// Registration validation for different user types
export const registerCustomerValidation = [
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

  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  body('address.street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),

  body('address.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),

  body('address.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),

  body('address.zipCode')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('Zip code must be between 5 and 10 characters'),

  body('address.coordinates.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('address.coordinates.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

export const registerRestaurantValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Restaurant name must be between 2 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('address.street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),

  body('address.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),

  body('address.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),

  body('address.zipCode')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('Zip code must be between 5 and 10 characters'),

  body('address.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude is required and must be between -90 and 90'),

  body('address.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude is required and must be between -180 and 180'),

  body('contactNumbers')
    .isArray({ min: 1, max: 3 })
    .withMessage('At least 1 and at most 3 contact numbers are required'),

  body('contactNumbers.*')
    .isMobilePhone('any')
    .withMessage('Please provide valid phone numbers'),

  body('cuisineTypes')
    .isArray({ min: 1, max: 10 })
    .withMessage('At least 1 and at most 10 cuisine types are required'),

  body('cuisineTypes.*')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each cuisine type must be between 2 and 50 characters'),

  body('deliveryFee')
    .isFloat({ min: 0, max: 50 })
    .withMessage('Delivery fee must be between 0 and 50'),

  body('minimumOrderAmount')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Minimum order amount must be between 0 and 1000'),

  body('estimatedDeliveryTime')
    .isInt({ min: 15, max: 120 })
    .withMessage('Estimated delivery time must be between 15 and 120 minutes'),

  body('businessHours')
    .isArray({ min: 7, max: 7 })
    .withMessage('Business hours for all 7 days of the week are required'),

  body('businessHours.*.day')
    .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day of week'),

  body('businessHours.*.openTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid opening time format (HH:mm)'),

  body('businessHours.*.closeTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid closing time format (HH:mm)'),

  body('businessHours.*.isClosed')
    .isBoolean()
    .withMessage('isClosed must be a boolean value')
];

export const registerDeliveryValidation = [
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

  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  body('restaurantId')
    .isMongoId()
    .withMessage('Please provide a valid restaurant ID'),

  body('vehicleType')
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

// Login validation
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('Remember me must be a boolean value')
];

// OTP validation
export const sendOtpValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('type')
    .isIn(['verification', 'password_reset'])
    .withMessage('OTP type must be verification or password_reset')
];

export const verifyOtpValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),

  body('type')
    .isIn(['verification', 'password_reset'])
    .withMessage('OTP type must be verification or password_reset')
];

// Password operations validation
export const resetPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
];

// Token operations validation
export const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isLength({ min: 10 })
    .withMessage('Invalid refresh token format')
];

export const logoutValidation = [
  body('refreshToken')
    .optional()
    .isLength({ min: 10 })
    .withMessage('Invalid refresh token format')
];

// Social auth validation
export const socialAuthValidation = [
  body('provider')
    .isIn(['google', 'facebook', 'apple'])
    .withMessage('Provider must be google, facebook, or apple'),

  body('token')
    .notEmpty()
    .withMessage('Social auth token is required'),

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

  body('profilePicture')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL')
];

// Email verification
export const resendVerificationEmailValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

// Two-factor authentication
export const enable2FAValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required to enable 2FA')
];

export const verify2FAValidation = [
  body('token')
    .isLength({ min: 6, max: 6 })
    .withMessage('2FA token must be 6 digits')
    .isNumeric()
    .withMessage('2FA token must contain only numbers')
];

export const disable2FAValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required to disable 2FA'),

  body('token')
    .isLength({ min: 6, max: 6 })
    .withMessage('2FA token must be 6 digits')
    .isNumeric()
    .withMessage('2FA token must contain only numbers')
];

// Account verification and recovery
export const requestPasswordResetValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

export const checkEmailExistsValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

// Security validation
export const updateSecuritySettingsValidation = [
  body('settings.twoFactorEnabled')
    .optional()
    .isBoolean()
    .withMessage('Two factor enabled must be a boolean value'),

  body('settings.loginNotifications')
    .optional()
    .isBoolean()
    .withMessage('Login notifications must be a boolean value'),

  body('settings.sessionTimeout')
    .optional()
    .isInt({ min: 15, max: 1440 })
    .withMessage('Session timeout must be between 15 and 1440 minutes')
];

// Device management
export const revokeDeviceValidation = [
  param('deviceId')
    .isMongoId()
    .withMessage('Please provide a valid device ID')
];

export const updateDeviceNameValidation = [
  param('deviceId')
    .isMongoId()
    .withMessage('Please provide a valid device ID'),

  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Device name must be between 1 and 50 characters')
];

// Legacy compatibility
export const registerValidation = registerCustomerValidation;
