import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '@/utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * Authentication middleware - Verifies JWT token
 * Adds decoded user info to req.user
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Missing or invalid authentication token',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('❌ JWT_SECRET not configured');
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Authentication service misconfigured',
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('❌ Invalid token:', error instanceof Error ? error.message : 'Unknown error');
    res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Invalid or expired token',
    });
  }
}

/**
 * Admin-only middleware - Requires role='admin'
 * Must be used AFTER authMiddleware
 */
export function adminOnly(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required',
    });
    return;
  }

  if (req.user.role !== 'admin') {
    logger.warn(`⚠️ Non-admin user (${req.user.email}) attempted admin action: ${req.method} ${req.path}`);
    res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Admin access required',
    });
    return;
  }

  next();
}

/**
 * Optional authentication - Doesn't fail without token
 * Useful for endpoints that have public + authenticated modes
 */
export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      const jwtSecret = process.env.JWT_SECRET || 'secret';
      const decoded = jwt.verify(token, jwtSecret) as any;
      req.user = decoded;
    }
  } catch (error) {
    logger.debug('Optional auth failed, continuing as anonymous');
  }

  next();
}
