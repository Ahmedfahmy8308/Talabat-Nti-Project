import { body } from 'express-validator';

export const updateDeliveryStatusValidation = [
  body('status')
    .isIn(['picked_up', 'delivered'])
    .withMessage('Status must be one of: picked_up, delivered')
];
