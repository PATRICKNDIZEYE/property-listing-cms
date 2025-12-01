import { Metadata } from 'next';
import StatsCards from '@/app/components/admin/dashboard/stats';
import RecentActivity from '@/app/components/admin/dashboard/recent-activity';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-midnight_text dark:text-white mb-8">
        Dashboard
      </h1>
      <StatsCards />
      <RecentActivity />
    </div>
  );
}

