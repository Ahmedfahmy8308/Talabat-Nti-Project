export interface IAuthService {
  login(email: string, password: string): Promise<any>;
  register(userData: any): Promise<any>;
  // Define other auth service interface methods here
}

export interface IAuthController {
  login(req: any, res: any, next: any): Promise<void>;
  register(req: any, res: any, next: any): Promise<void>;
  // Define other auth controller interface methods here
}

export interface IAuthResponse {
  token: string;
  user: any;
  expiresIn: number;
}
