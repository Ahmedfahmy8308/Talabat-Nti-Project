export interface RegisterUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'restaurant' | 'delivery';
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
  // Restaurant specific fields
  restaurantDetails?: {
    name: string;
    description?: string;
    cuisineType: string[];
    averageDeliveryTime: number;
    minimumOrderAmount: number;
    deliveryFee: number;
    serviceRadius: number;
  };
  businessInfo?: {
    licenseNumber: string;
    taxId: string;
  };
  // Delivery specific fields
  vehicleInfo?: {
    type: 'bike' | 'car' | 'motorcycle' | 'scooter';
    licensePlate?: string;
    color?: string;
    model?: string;
  };
  deliveryZones?: string[];
  documents?: {
    licenseNumber?: string;
    licenseImage?: string;
    vehicleRegistration?: string;
    identityProof?: string;
  };
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface VerifyOTPDTO {
  email: string;
  otp: string;
  type: 'registration' | 'password-reset';
}

export interface ResendOTPDTO {
  email: string;
  type: 'registration' | 'password-reset';
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}
