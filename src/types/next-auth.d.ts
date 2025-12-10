import { UserRole } from '@/app/types/auth';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: UserRole;
      image?: string;
    };
  }

  interface User {
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    id: string;
    lastActivity?: number; // Timestamp of last user activity
    iat?: number; // Issued at time
    expired?: boolean; // Whether session expired due to inactivity
    expiredAt?: number; // When the session expired
  }
}

