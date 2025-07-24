export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface UpdateRestaurantProfileDTO extends UpdateProfileDTO {
  restaurantDetails?: {
    name?: string;
    description?: string;
    cuisineType?: string[];
    averageDeliveryTime?: number;
    minimumOrderAmount?: number;
    deliveryFee?: number;
    serviceRadius?: number;
    openingHours?: {
      [key: string]: {
        open: string;
        close: string;
        isOpen: boolean;
      };
    };
  };
  businessInfo?: {
    bankAccountDetails?: {
      bankName: string;
      accountNumber: string;
      routingNumber: string;
    };
  };
}

export interface UpdateDeliveryProfileDTO extends UpdateProfileDTO {
  vehicleInfo?: {
    type?: 'bike' | 'car' | 'motorcycle' | 'scooter';
    licensePlate?: string;
    color?: string;
    model?: string;
  };
  workingHours?: {
    [key: string]: {
      start: string;
      end: string;
      isWorking: boolean;
    };
  };
  deliveryZones?: string[];
}

export interface AddToFavoritesDTO {
  restaurantId: string;
}

export interface UpdateLocationDTO {
  lat: number;
  lng: number;
}
