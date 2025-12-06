import { getServerSession } from 'next-auth';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '@/app/types/auth';
import { authOptions } from './auth-config';

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
    },
  });

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== UserRole.ADMIN) {
    throw new Error('Unauthorized: Admin access required');
  }
  return user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === UserRole.ADMIN;
}

