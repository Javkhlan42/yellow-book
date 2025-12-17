import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

// Middleware to validate NextAuth session token from cookie
export async function validateSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const sessionToken = req.cookies['next-auth.session-token'] || req.cookies['__Secure-next-auth.session-token'];
    
    if (!sessionToken) {
      return next(); // Continue without user
    }
    
    // In production, validate session token against database
    // For now, we'll implement a simple version
    // You should use Prisma to validate the session token:
    // const session = await prisma.session.findUnique({
    //   where: { sessionToken },
    //   include: { user: true }
    // });
    
    // if (session && session.expires > new Date()) {
    //   req.user = {
    //     id: session.user.id,
    //     email: session.user.email,
    //     role: session.user.role
    //   };
    // }
    
    next();
  } catch (error) {
    console.error('Session validation error:', error);
    next();
  }
}
