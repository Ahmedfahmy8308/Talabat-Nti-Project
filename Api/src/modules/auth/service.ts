import { UserService, CreateUserData } from '../user/service';
import { comparePassword, generateToken } from '../../utils/helpers';
import { AppError } from '../../middlewares/error.middleware';

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  token: string;
}

export class AuthService {
  static async register(userData: CreateUserData): Promise<AuthResponse> {
    const user = await UserService.createUser(userData);
    const token = generateToken(user._id);

    return {
      user,
      token
    };
  }

  static async login(loginData: LoginData): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Find user with password field included
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account has been deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    await UserService.updateLastLogin(user._id);

    // Generate token
    const token = generateToken(user._id);

    // Remove password from user object
    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      token
    };
  }

  static async verifyToken(token: string): Promise<any> {
    // This would typically verify the token and return user data
    // Implementation depends on your JWT verification logic
    return null;
  }
}
