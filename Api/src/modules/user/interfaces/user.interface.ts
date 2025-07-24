import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'customer' | 'restaurant' | 'delivery';
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
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserService {
  updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser>;
  deleteUser(userId: string): Promise<void>;
  getUserById(userId: string): Promise<IUser | null>;
}

export interface IUserController {
  getProfile(req: any, res: any, next: any): Promise<void>;
  updateProfile(req: any, res: any, next: any): Promise<void>;
  deleteAccount(req: any, res: any, next: any): Promise<void>;
}
