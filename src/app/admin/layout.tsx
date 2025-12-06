import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/app/components/admin/sidebar';
import { authOptions } from '@/lib/auth-config';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      // If no session or not admin, check if we're already on login page
      // If not, redirect to login
      redirect('/admin/login');
    }

    // User is authenticated and is admin - show admin layout
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-darkmode">
        <AdminSidebar />
        <main className="flex-1 ml-64">
          <div className="p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  } catch (error: any) {
    // If there's a JWT error (like decryption failed), just render children
    // This allows the login page to show even with corrupted cookies
    // The login page will handle its own rendering
    return <>{children}</>;
  }
}

