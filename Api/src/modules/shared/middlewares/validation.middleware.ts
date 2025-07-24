import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './error.middleware';

// Express-validator based validation middleware (legacy support)
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Run all validations
      await Promise.all(validations.map(validation => validation.run(req)));

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Manual validation middleware for object validation
export const validateRequest = (validationSchema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error, value } = validationSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errorMessages = error.details.map((detail: any) => detail.message);
        throw new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400);
      }

      // Replace req.body with validated and sanitized data
      req.body = value;
      next();
    } catch (validationError) {
      next(validationError);
    }
  };
};

// Custom validation functions
export const validateAuthRegistration = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { email, password, role } = req.body;
    const errors: string[] = [];

    // Email validation
    if (!email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }

    // Password validation
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    } else if (password.length > 100) {
      errors.push('Password must be less than 100 characters');
    }

    // Role validation
    if (!role) {
      errors.push('Role is required');
    } else if (!['customer', 'restaurant', 'delivery'].includes(role)) {
      errors.push('Role must be one of: customer, restaurant, delivery');
    }

    // Role-specific validations
    if (role === 'customer') {
      const { firstName, lastName } = req.body;
      if (!firstName || firstName.trim().length < 2) {
        errors.push('First name is required and must be at least 2 characters');
      }
      if (!lastName || lastName.trim().length < 2) {
        errors.push('Last name is required and must be at least 2 characters');
      }
    }

    if (role === 'restaurant') {
      const { name, description, contactNumbers, address } = req.body;
      if (!name || name.trim().length < 2) {
        errors.push('Restaurant name is required and must be at least 2 characters');
      }
      if (!description || description.trim().length < 10) {
        errors.push('Restaurant description is required and must be at least 10 characters');
      }
      if (!contactNumbers || !Array.isArray(contactNumbers) || contactNumbers.length === 0) {
        errors.push('At least one contact number is required');
      }
      if (!address || !address.street || !address.city || !address.state || !address.zipCode) {
        errors.push('Complete address is required (street, city, state, zipCode)');
      }
    }

    if (role === 'delivery') {
      const { name, phone } = req.body;
      if (!name || name.trim().length < 2) {
        errors.push('Name is required and must be at least 2 characters');
      }
      if (!phone || phone.trim().length < 10) {
        errors.push('Phone number is required and must be at least 10 characters');
      }
    }

    if (errors.length > 0) {
      throw new AppError(`Validation failed: ${errors.join(', ')}`, 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateAuthLogin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { email, password } = req.body;
    const errors: string[] = [];

    if (!email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      throw new AppError(`Validation failed: ${errors.join(', ')}`, 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateOTP = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { email, otp } = req.body;
    const errors: string[] = [];

    if (!email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!otp) {
      errors.push('OTP is required');
    } else if (!/^\d{6}$/.test(otp)) {
      errors.push('OTP must be exactly 6 digits');
    }

    if (errors.length > 0) {
      throw new AppError(`Validation failed: ${errors.join(', ')}`, 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateEmail = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError('Please provide a valid email address', 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validatePasswordReset = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { email, otp, newPassword } = req.body;
    const errors: string[] = [];

    if (!email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!otp) {
      errors.push('OTP is required');
    } else if (!/^\d{6}$/.test(otp)) {
      errors.push('OTP must be exactly 6 digits');
    }

    if (!newPassword) {
      errors.push('New password is required');
    } else if (newPassword.length < 6) {
      errors.push('New password must be at least 6 characters long');
    } else if (newPassword.length > 100) {
      errors.push('New password must be less than 100 characters');
    }

    if (errors.length > 0) {
      throw new AppError(`Validation failed: ${errors.join(', ')}`, 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateChangePassword = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { currentPassword, newPassword } = req.body;
    const errors: string[] = [];

    if (!currentPassword) {
      errors.push('Current password is required');
    }

    if (!newPassword) {
      errors.push('New password is required');
    } else if (newPassword.length < 6) {
      errors.push('New password must be at least 6 characters long');
    } else if (newPassword.length > 100) {
      errors.push('New password must be less than 100 characters');
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.push('New password must be different from current password');
    }

    if (errors.length > 0) {
      throw new AppError(`Validation failed: ${errors.join(', ')}`, 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Sanitization helpers
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const sanitizeString = (str: string): string => {
      return str.trim().replace(/[<>]/g, '');
    };

    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return sanitizeString(obj);
      } else if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      } else if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            sanitized[key] = sanitizeObject(obj[key]);
          }
        }
        return sanitized;
      }
      return obj;
    };

    req.body = sanitizeObject(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
