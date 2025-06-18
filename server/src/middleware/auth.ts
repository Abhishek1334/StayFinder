import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import User from '../models/User';
import { sendError } from '../utils/responseHandler';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from cookie
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return sendError(res, 'Not authorized, no token', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return sendError(res, 'User not found', 404);
      }

      // Set user in request
      req.user = {
        id: user._id.toString(),
        role: user.role,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return sendError(res, 'Invalid token', 401);
      }
      if (error instanceof jwt.TokenExpiredError) {
        return sendError(res, 'Token expired', 401);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user?.role) {
      return sendError(res, 'Not authorized', 403);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Not authorized to access this route', 403);
    }

    next();
  };
}; 