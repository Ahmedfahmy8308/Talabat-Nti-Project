export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isEmailVerified: boolean;
      isActive: boolean;
    };
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface ILoginResponse extends IAuthResponse {
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isEmailVerified: boolean;
      isActive: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface IRegisterResponse extends IAuthResponse {
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isEmailVerified: boolean;
      isActive: boolean;
    };
    otpSent: boolean;
  };
}

export interface IVerifyOTPResponse extends IAuthResponse {
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isEmailVerified: boolean;
      isActive: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface IOTPRecord {
  email: string;
  otp: string;
  type: 'registration' | 'password-reset';
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
}
