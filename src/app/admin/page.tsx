import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import EnhancedStats from '@/app/components/admin/dashboard/EnhancedStats';
import RecentActivity from '@/app/components/admin/dashboard/recent-activity';
import QuickActions from '@/app/components/admin/dashboard/quick-actions';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8">
      {/* Welcome Header - Enhanced Design */}
      <div className="bg-gradient-to-r from-primary via-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-32 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon="ion:sunny-outline" className="w-6 h-6" />
              <span className="text-sm font-semibold text-blue-100">Good to see you!</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {session?.user?.name || 'Admin'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Track your property business performance and manage all your listings from here.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats */}
      <EnhancedStats />
      
      {/* Quick Actions - Enhanced Design */}
      <div className="bg-white dark:bg-semidark rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-midnight_text dark:text-white flex items-center gap-2">
              <Icon icon="ion:flash-outline" className="w-6 h-6 text-primary" />
              Quick Actions
            </h2>
            <p className="text-sm text-gray dark:text-gray mt-1">
              Fast access to common tasks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Add Property Card */}
          <Link
            href="/admin/properties/new"
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-400/0 group-hover:from-blue-400/5 group-hover:to-blue-400/10 transition-all"></div>
            <div className="relative z-10">
              <div className="p-3 bg-white dark:bg-semidark rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <Icon icon="ion:home-plus-outline" className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-midnight_text dark:text-white text-lg mb-1">
                Add Property
              </h3>
              <p className="text-sm text-gray dark:text-gray">Create new listing</p>
            </div>
          </Link>

          {/* Write Blog Card */}
          <Link
            href="/admin/blogs/new"
            className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-800 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-400/0 group-hover:from-green-400/5 group-hover:to-green-400/10 transition-all"></div>
            <div className="relative z-10">
              <div className="p-3 bg-white dark:bg-semidark rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <Icon icon="ion:pencil-outline" className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-midnight_text dark:text-white text-lg mb-1">
                Write Blog
              </h3>
              <p className="text-sm text-gray dark:text-gray">Create new post</p>
            </div>
          </Link>

          {/* Settings Card */}
          <Link
            href="/admin/settings"
            className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-400/0 group-hover:from-purple-400/5 group-hover:to-purple-400/10 transition-all"></div>
            <div className="relative z-10">
              <div className="p-3 bg-white dark:bg-semidark rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <Icon icon="ion:settings-outline" className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-midnight_text dark:text-white text-lg mb-1">
                Settings
              </h3>
              <p className="text-sm text-gray dark:text-gray">Manage site</p>
            </div>
          </Link>

          {/* Media Card */}
          <Link
            href="/admin/images"
            className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-orange-400/0 group-hover:from-orange-400/5 group-hover:to-orange-400/10 transition-all"></div>
            <div className="relative z-10">
              <div className="p-3 bg-white dark:bg-semidark rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                <Icon icon="ion:images-outline" className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-midnight_text dark:text-white text-lg mb-1">
                Media
              </h3>
              <p className="text-sm text-gray dark:text-gray">Upload files</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Management Features & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Management Features */}
        <div className="bg-white dark:bg-semidark rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white flex items-center gap-2">
                <Icon icon="ion:grid-outline" className="w-6 h-6 text-primary" />
                Management
              </h2>
              <p className="text-sm text-gray dark:text-gray mt-1">
                Organize and manage your content
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {/* Properties */}
            <Link href="/admin/properties" className="group flex items-center justify-between p-4 border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/10 dark:to-blue-900/5 rounded-xl hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon icon="ion:home-outline" className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-midnight_text dark:text-white">Properties</h3>
                  <p className="text-xs text-gray dark:text-gray">Manage all listings</p>
                </div>
              </div>
              <Icon icon="ion:chevron-forward-outline" className="w-5 h-5 text-gray group-hover:text-primary transition-colors" />
            </Link>
            
            {/* Blogs */}
            <Link href="/admin/blogs" className="group flex items-center justify-between p-4 border border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-900/10 dark:to-green-900/5 rounded-xl hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon icon="ion:document-text-outline" className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-midnight_text dark:text-white">Blogs</h3>
                  <p className="text-xs text-gray dark:text-gray">Create and edit posts</p>
                </div>
              </div>
              <Icon icon="ion:chevron-forward-outline" className="w-5 h-5 text-gray group-hover:text-primary transition-colors" />
            </Link>
            
            {/* Media Library */}
            <Link href="/admin/images" className="group flex items-center justify-between p-4 border border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-yellow-50/50 dark:from-yellow-900/10 dark:to-yellow-900/5 rounded-xl hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon icon="ion:images-outline" className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-midnight_text dark:text-white">Media</h3>
                  <p className="text-xs text-gray dark:text-gray">Upload and organize files</p>
                </div>
              </div>
              <Icon icon="ion:chevron-forward-outline" className="w-5 h-5 text-gray group-hover:text-primary transition-colors" />
            </Link>
            
            {/* Settings */}
            <Link href="/admin/settings" className="group flex items-center justify-between p-4 border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-900/10 dark:to-purple-900/5 rounded-xl hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon icon="ion:settings-outline" className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-midnight_text dark:text-white">Settings</h3>
                  <p className="text-xs text-gray dark:text-gray">Configure your site</p>
                </div>
              </div>
              <Icon icon="ion:chevron-forward-outline" className="w-5 h-5 text-gray group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}

