import rateLimit from 'express-rate-limit';
import { logger } from '@/utils/logger';

/**
 * Contact form rate limiter - 5 emails per hour per IP
 */
export const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per window
  message: 'Too many contact form submissions. Please try again in 1 hour.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    if (req.path === '/health') {
      return true;
    }
    return false;
  },
  keyGenerator: (req) => {
    // Use IP address as key (respects X-Forwarded-For for proxies)
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  handler: (req, res) => {
    logger.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'Too many contact form submissions. Please try again later.',
      retryAfter: req.rateLimit?.resetTime,
    });
  },
  onLimitReached: (req) => {
    logger.warn(`⚠️ Rate limit threshold reached for IP: ${req.ip}`);
  },
});

/**
 * Global API rate limiter - 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip for health checks
    if (req.path === '/health') {
      return true;
    }
    return false;
  },
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});

/**
 * Search rate limiter - 30 searches per 5 minutes per IP
 */
export const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 requests per window
  message: 'Too many search requests. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});

/**
 * Admin action rate limiter - 50 actions per hour per user
 */
export const adminActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 actions per hour
  message: 'Too many admin actions. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    const user = (req as any).user;
    return user?.id ? `user-${user.id}` : (req.ip || 'unknown');
  },
});
