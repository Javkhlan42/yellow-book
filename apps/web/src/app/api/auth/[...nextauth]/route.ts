import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

/**
 * Enqueue sign-in notification job
 * Makes HTTP request to backend API to enqueue job
 */
async function enqueueSignInNotification(data: {
  userId: string;
  email: string;
  name: string;
  provider: string;
  ipAddress: string;
  userAgent: string;
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/api/jobs/signin-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to enqueue job');
    }

    const result = await response.json();
    console.log('[NextAuth] Sign-in notification job enqueued:', result.jobId);
  } catch (error: any) {
    console.error('[NextAuth] Failed to enqueue sign-in notification:', error.message);
    // Don't throw - we don't want to block sign-in if job enqueue fails
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: '/api/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Enqueue background job for sign-in notification
      if (user.email && user.name) {
        // Get request details from headers (Note: In production, use proper request context)
        const ipAddress = '0.0.0.0'; // Placeholder - would need middleware to capture real IP
        const userAgent = 'Mozilla/5.0'; // Placeholder - would need middleware to capture

        await enqueueSignInNotification({
          userId: user.id,
          email: user.email,
          name: user.name,
          provider: account?.provider || 'unknown',
          ipAddress,
          userAgent,
        });
      }
      
      return true; // Allow sign-in
    },
    async session({ session, user }) {
      if (session?.user) {
        (session.user as any).id = user.id;
        (session.user as any).role = (user as any).role || 'user';
      }
      return session;
    },
  },
  session: {
    strategy: 'database',
  },
  // CSRF protection enabled by default in NextAuth
  // Using secure cookies in production
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  // Enable debug mode to see detailed errors
  debug: true,
  // Logging
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', code, metadata);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
