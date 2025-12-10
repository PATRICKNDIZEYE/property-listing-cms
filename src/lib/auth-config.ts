import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import { verifyPassword } from './auth';

// Session configuration constants
const SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds
const SESSION_UPDATE_AGE = 15 * 60; // 15 minutes - refresh session every 15 min of activity
const INACTIVITY_TIMEOUT = 30 * 60; // 30 minutes of inactivity before session expires

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE, // Total session lifetime: 8 hours
    updateAge: SESSION_UPDATE_AGE, // Refresh session every 15 minutes of activity
  },
  jwt: {
    maxAge: SESSION_MAX_AGE, // JWT token expires after 8 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production',
  pages: {
    signIn: '/signin',
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      const now = Math.floor(Date.now() / 1000);
      
      // On initial login, set user data and activity timestamp
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.lastActivity = now; // Current timestamp in seconds
        token.iat = now; // Issued at time
        token.expired = false;
        return token;
      }
      
      // Get current lastActivity or use issued at time as fallback
      const lastActivity = (token.lastActivity as number) || token.iat || now;
      const inactiveTime = now - lastActivity;
      
      // On session update (triggered by activity via update() call), update lastActivity
      // This is the primary way to refresh activity when user is active
      if (trigger === 'update') {
        token.lastActivity = now;
        token.expired = false;
        return token;
      }
      
      // Fallback: Update lastActivity on JWT callback if user is still active
      // This ensures session refresh calls properly update activity even if trigger === 'update' doesn't fire
      // Only update if:
      // 1. User hasn't exceeded inactivity timeout
      // 2. At least 1 minute has passed since last update (to avoid excessive updates on every request)
      if (inactiveTime <= INACTIVITY_TIMEOUT && !token.expired) {
        const timeSinceLastUpdate = now - lastActivity;
        // Update activity timestamp if at least 1 minute has passed (throttle to avoid excessive updates)
        if (timeSinceLastUpdate >= 60) {
          token.lastActivity = now;
        }
      }
      
      // Check for inactivity timeout with updated lastActivity
      const currentLastActivity = (token.lastActivity as number) || token.iat || now;
      const currentInactiveTime = now - currentLastActivity;
      
      // If user has been inactive for more than INACTIVITY_TIMEOUT, mark as expired
      if (currentInactiveTime > INACTIVITY_TIMEOUT) {
        token.expired = true;
        token.expiredAt = now;
      } else {
        token.expired = false;
      }
      
      return token;
    },
    async session({ session, token }) {
      // If token is expired due to inactivity, return null session
      if (!token || !token.id || token.expired) {
        return null as any;
      }
      
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as any,
          image: user.image,
        } as any;
      },
    }),
  ],
};

