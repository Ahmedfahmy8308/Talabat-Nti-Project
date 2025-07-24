export interface IRestaurantService {
  // Define restaurant service interface methods here
}

export interface IRestaurantController {
  // Define restaurant controller interface methods here
}

export interface IRestaurant {
  _id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  cuisine: string[];
  rating?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
