import User, { IUser } from '../schemas/user.schema';
import { hashPassword } from '../../shared/utils/helpers';
import { AppError } from '../../shared/middlewares/error.middleware';

export interface CreateUserData {
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
}

export interface UpdateUserData {
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
  avatar?: string;
}

export class UserService {
  static async createUser(userData: CreateUserData): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = new User({
      ...userData,
      password: hashedPassword
    });

    await user.save();
    return user;
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  static async updateUser(userId: string, updateData: UpdateUserData): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  static async deleteUser(userId: string): Promise<void> {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
  }

  static async getAllUsers(
    page: number = 1,
    limit: number = 10,
    role?: string,
    search?: string
  ): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = { isActive: true };

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    return { users, total };
  }

  static async updateUserRole(userId: string, role: string): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  static async deactivateUser(userId: string): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  static async updateLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
  }
}
