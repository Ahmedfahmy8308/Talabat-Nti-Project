export { User, IBaseUser } from './base-user.schema';

export { Admin, type IAdmin } from './admin.schema';
export { Customer, type ICustomer } from './customer.schema';
export { Restaurant, type IRestaurant } from './restaurant.schema';
export { Delivery, type IDelivery } from './delivery.schema';

import { type IAdmin } from './admin.schema';
import { type ICustomer } from './customer.schema';
import { type IRestaurant } from './restaurant.schema';
import { type IDelivery } from './delivery.schema';

export type IUser = IAdmin | ICustomer | IRestaurant | IDelivery;

export type UserByRole<T extends string> = T extends 'admin'
  ? IAdmin
  : T extends 'customer'
    ? ICustomer
    : T extends 'restaurant'
      ? IRestaurant
      : T extends 'delivery'
        ? IDelivery
        : never;
