import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import StatsCards from '@/app/components/admin/dashboard/stats';
import RecentActivity from '@/app/components/admin/dashboard/recent-activity';
import QuickActions from '@/app/components/admin/dashboard/quick-actions';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-midnight_text dark:text-white">
            Welcome back, {session?.user?.name || 'Admin'}!
          </h1>
          <p className="text-gray dark:text-gray mt-2">
            Here's what's happening with your property business today.
          </p>
        </div>
      </div>
      
      <StatsCards />
      
      <QuickActions />
      
      <RecentActivity />
    </div>
  );
}

