import { body, query, param } from 'express-validator';

// Restaurant update validation
export const updateRestaurantValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Restaurant name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),

  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),

  body('address.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),

  body('address.zipCode')
    .optional()
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
    .withMessage('Longitude must be between -180 and 180'),

  body('contactNumbers')
    .optional()
    .isArray({ min: 1, max: 3 })
    .withMessage('At least 1 and at most 3 contact numbers are required'),

  body('contactNumbers.*')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide valid phone numbers'),

  body('cuisineTypes')
    .optional()
    .isArray({ min: 1, max: 10 })
    .withMessage('At least 1 and at most 10 cuisine types are required'),

  body('cuisineTypes.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each cuisine type must be between 2 and 50 characters'),

  body('deliveryFee')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Delivery fee must be between 0 and 50'),

  body('minimumOrderAmount')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Minimum order amount must be between 0 and 1000'),

  body('estimatedDeliveryTime')
    .optional()
    .isInt({ min: 15, max: 120 })
    .withMessage('Estimated delivery time must be between 15 and 120 minutes'),

  body('businessHours')
    .optional()
    .isArray({ min: 7, max: 7 })
    .withMessage('Business hours for all 7 days of the week are required'),

  body('businessHours.*.day')
    .optional()
    .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day of week'),

  body('businessHours.*.openTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid opening time format (HH:mm)'),

  body('businessHours.*.closeTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid closing time format (HH:mm)'),

  body('businessHours.*.isClosed')
    .optional()
    .isBoolean()
    .withMessage('isClosed must be a boolean value')
];

// Restaurant query validation
export const restaurantQueryValidation = [
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

  query('cuisine')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Cuisine filter cannot exceed 50 characters'),

  query('minRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Minimum rating must be between 0 and 5'),

  query('maxDeliveryFee')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Maximum delivery fee must be between 0 and 50'),

  query('sortBy')
    .optional()
    .isIn(['rating', 'deliveryTime', 'deliveryFee', 'createdAt', 'name'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  query('isOpen')
    .optional()
    .isBoolean()
    .withMessage('isOpen must be a boolean value'),

  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  query('radius')
    .optional()
    .isFloat({ min: 0.1, max: 50 })
    .withMessage('Radius must be between 0.1 and 50 kilometers')
];

// Meal validation
export const createMealValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Meal name must be between 2 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('price')
    .isFloat({ min: 0.01, max: 1000 })
    .withMessage('Price must be between 0.01 and 1000'),

  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),

  body('preparationTime')
    .isInt({ min: 1, max: 120 })
    .withMessage('Preparation time must be between 1 and 120 minutes'),

  body('ingredients')
    .isArray({ min: 1, max: 50 })
    .withMessage('At least 1 and at most 50 ingredients are required'),

  body('ingredients.*')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Each ingredient must be between 2 and 100 characters'),

  body('allergens')
    .optional()
    .isArray({ max: 20 })
    .withMessage('At most 20 allergens can be specified'),

  body('allergens.*')
    .optional()
    .isIn(['nuts', 'dairy', 'eggs', 'fish', 'shellfish', 'soy', 'wheat', 'sesame'])
    .withMessage('Invalid allergen type'),

  body('nutritionalInfo.calories')
    .optional()
    .isInt({ min: 0, max: 5000 })
    .withMessage('Calories must be between 0 and 5000'),

  body('nutritionalInfo.protein')
    .optional()
    .isFloat({ min: 0, max: 200 })
    .withMessage('Protein must be between 0 and 200 grams'),

  body('nutritionalInfo.carbs')
    .optional()
    .isFloat({ min: 0, max: 500 })
    .withMessage('Carbs must be between 0 and 500 grams'),

  body('nutritionalInfo.fat')
    .optional()
    .isFloat({ min: 0, max: 200 })
    .withMessage('Fat must be between 0 and 200 grams'),

  body('spiceLevel')
    .optional()
    .isIn(['mild', 'medium', 'hot', 'very_hot'])
    .withMessage('Spice level must be mild, medium, hot, or very_hot'),

  body('isVegetarian')
    .optional()
    .isBoolean()
    .withMessage('isVegetarian must be a boolean value'),

  body('isVegan')
    .optional()
    .isBoolean()
    .withMessage('isVegan must be a boolean value'),

  body('isGlutenFree')
    .optional()
    .isBoolean()
    .withMessage('isGlutenFree must be a boolean value'),

  body('customizations')
    .optional()
    .isArray({ max: 20 })
    .withMessage('At most 20 customizations can be specified'),

  body('customizations.*.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Customization name must be between 2 and 50 characters'),

  body('customizations.*.options')
    .optional()
    .isArray({ min: 1, max: 10 })
    .withMessage('Each customization must have 1 to 10 options'),

  body('customizations.*.options.*.name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Option name must be between 1 and 50 characters'),

  body('customizations.*.options.*.priceModifier')
    .optional()
    .isFloat({ min: -50, max: 50 })
    .withMessage('Price modifier must be between -50 and 50')
];

export const updateMealValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Meal name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0.01, max: 1000 })
    .withMessage('Price must be between 0.01 and 1000'),

  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),

  body('preparationTime')
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage('Preparation time must be between 1 and 120 minutes'),

  body('ingredients')
    .optional()
    .isArray({ min: 1, max: 50 })
    .withMessage('At least 1 and at most 50 ingredients are required'),

  body('ingredients.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Each ingredient must be between 2 and 100 characters'),

  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean value'),

  body('spiceLevel')
    .optional()
    .isIn(['mild', 'medium', 'hot', 'very_hot'])
    .withMessage('Spice level must be mild, medium, hot, or very_hot')
];

// Meal query validation
export const mealQueryValidation = [
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

  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category filter cannot exceed 50 characters'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be 0 or greater'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be 0 or greater'),

  query('isVegetarian')
    .optional()
    .isBoolean()
    .withMessage('isVegetarian must be a boolean value'),

  query('isVegan')
    .optional()
    .isBoolean()
    .withMessage('isVegan must be a boolean value'),

  query('isGlutenFree')
    .optional()
    .isBoolean()
    .withMessage('isGlutenFree must be a boolean value'),

  query('spiceLevel')
    .optional()
    .isIn(['mild', 'medium', 'hot', 'very_hot'])
    .withMessage('Spice level must be mild, medium, hot, or very_hot'),

  query('sortBy')
    .optional()
    .isIn(['price', 'rating', 'preparationTime', 'createdAt', 'name'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  query('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean value')
];

// Parameter validation
export const restaurantIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid restaurant ID')
];

export const mealIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Please provide a valid meal ID')
];

// Restaurant status validation
export const updateRestaurantStatusValidation = [
  body('isOpen')
    .isBoolean()
    .withMessage('isOpen must be a boolean value')
];

// Bulk meal operations
export const bulkUpdateMealsValidation = [
  body('mealIds')
    .isArray({ min: 1, max: 50 })
    .withMessage('At least 1 and at most 50 meal IDs are required'),

  body('mealIds.*')
    .isMongoId()
    .withMessage('Each meal ID must be valid'),

  body('updateData.isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean value'),

  body('updateData.price')
    .optional()
    .isFloat({ min: 0.01, max: 1000 })
    .withMessage('Price must be between 0.01 and 1000')
];
