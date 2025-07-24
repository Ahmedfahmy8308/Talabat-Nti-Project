import { body } from 'express-validator';

export const updateUserRoleValidation = [
  body('role')
    .isIn(['admin', 'customer', 'restaurant', 'delivery'])
    .withMessage('Role must be one of: admin, customer, restaurant, delivery')
];
