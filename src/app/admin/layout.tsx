import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import AdminLayout from '@/app/components/admin/layout/AdminLayout';
import { headers } from 'next/headers';

// Admin depends on request headers/session, so it must be dynamic.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await getServerSession(authOptions);

    // Read current path injected by middleware so we can allow rendering the
    // login page (/admin/login) without redirecting to itself.
    const headersList = await headers();
    const currentPath = headersList.get('x-current-path') || '';

    if (!session || session.user?.role !== 'ADMIN') {
      // Allow the login page to render without redirecting to itself.
      if (currentPath === '/admin/login') {
        return <>{children}</>;
      }

      // If not on the login page, redirect to login.
      redirect('/admin/login');
    }

    // User is authenticated and is admin - show admin layout
    return <AdminLayout>{children}</AdminLayout>;
  } catch (error: any) {
    // If the error is the special NEXT_REDIRECT thrown by Next.js `redirect()`
    // then rethrow it so the framework handles the redirect behavior. We don't
    // want to log or swallow that error because it's not an application bug.
    const digest = error?.digest as string | undefined;
    const message = typeof error?.message === 'string' ? error.message : undefined;
    if (digest?.startsWith('NEXT_REDIRECT') || message?.includes('NEXT_REDIRECT')) {
      throw error;
    }

    // For any other error, log it and redirect to the login page.
    // eslint-disable-next-line no-console
    console.error('Error resolving admin session in layout:', error);
    redirect('/admin/login');
  }
}

