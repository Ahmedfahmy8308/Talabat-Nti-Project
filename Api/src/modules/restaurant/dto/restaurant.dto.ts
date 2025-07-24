import { body } from 'express-validator';

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
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('category')
    .isIn(['appetizer', 'main', 'dessert', 'beverage', 'salad', 'soup', 'side'])
    .withMessage('Category must be one of: appetizer, main, dessert, beverage, salad, soup, side'),

  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),

  body('ingredients.*')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each ingredient must be between 2 and 50 characters'),

  body('preparationTime')
    .isInt({ min: 1 })
    .withMessage('Preparation time must be at least 1 minute'),

  body('calories')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Calories must be a positive number'),

  body('allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array'),

  body('allergens.*')
    .optional()
    .isIn(['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'fish'])
    .withMessage('Invalid allergen specified'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Each tag must be between 2 and 30 characters')
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
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('category')
    .optional()
    .isIn(['appetizer', 'main', 'dessert', 'beverage', 'salad', 'soup', 'side'])
    .withMessage('Category must be one of: appetizer, main, dessert, beverage, salad, soup, side'),

  body('ingredients')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),

  body('ingredients.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each ingredient must be between 2 and 50 characters'),

  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),

  body('preparationTime')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Preparation time must be at least 1 minute'),

  body('calories')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Calories must be a positive number'),

  body('allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array'),

  body('allergens.*')
    .optional()
    .isIn(['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'fish'])
    .withMessage('Invalid allergen specified'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Each tag must be between 2 and 30 characters')
];
