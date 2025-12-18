import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Simple CSRF protection middleware
 * Validates CSRF token from header against session token
 */

const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'csrf-token';

/**
 * Generate a random CSRF token
 */
export const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Middleware to generate and set CSRF token
 * Should be applied to GET requests to set the token
 */
export const setCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only generate new token if not exists
  if (!req.cookies?.[CSRF_COOKIE_NAME]) {
    const token = generateCsrfToken();
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
  next();
};

/**
 * Middleware to verify CSRF token
 * Should be applied to state-changing requests (POST, PUT, DELETE, PATCH)
 */
export const verifyCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip CSRF check for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const tokenFromHeader = req.headers[CSRF_TOKEN_HEADER] as string;
  const tokenFromCookie = req.cookies?.[CSRF_COOKIE_NAME];

  if (!tokenFromHeader || !tokenFromCookie) {
    return res.status(403).json({ error: 'CSRF token missing' });
  }

  if (tokenFromHeader !== tokenFromCookie) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

/**
 * Combined middleware: Set token on GET, verify on state-changing methods
 */
export const csrfProtection = [setCsrfToken, verifyCsrfToken];
