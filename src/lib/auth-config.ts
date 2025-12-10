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
      // On initial login, set user data and activity timestamp
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.lastActivity = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        token.iat = Math.floor(Date.now() / 1000); // Issued at time
      }
      
      // On session update (triggered by activity), update lastActivity
      if (trigger === 'update') {
        token.lastActivity = Math.floor(Date.now() / 1000);
      }
      
      // Check for inactivity timeout
      const now = Math.floor(Date.now() / 1000);
      const lastActivity = (token.lastActivity as number) || token.iat || now;
      const inactiveTime = now - lastActivity;
      
      // If user has been inactive for more than INACTIVITY_TIMEOUT, mark as expired
      if (inactiveTime > INACTIVITY_TIMEOUT) {
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

