'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function AdminHeader({ sidebarCollapsed, toggleSidebar }: AdminHeaderProps) {
  const { data: session } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white dark:bg-semidark border-b border-border dark:border-dark_border px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors"
          aria-label="Toggle sidebar"
        >
          <Icon 
            icon={sidebarCollapsed ? 'ion:menu-outline' : 'ion:close-outline'} 
            className="w-6 h-6 text-midnight_text dark:text-white" 
          />
        </button>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-midnight_text dark:text-white">
            Admin Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Icon icon="ion:add-outline" className="w-4 h-4" />
            New Property
          </Link>
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Icon icon="ion:create-outline" className="w-4 h-4" />
            New Blog
          </Link>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors">
          <Icon icon="ion:notifications-outline" className="w-6 h-6 text-midnight_text dark:text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={session?.user?.image || "/images/avatar/avatar_1.jpg"}
                alt="Admin Avatar"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-midnight_text dark:text-white">
                {session?.user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray dark:text-gray">
                Administrator
              </p>
            </div>
            <Icon icon="ion:chevron-down-outline" className="w-4 h-4 text-midnight_text dark:text-white" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-semidark border border-border dark:border-dark_border rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-border dark:border-dark_border">
                <p className="font-medium text-midnight_text dark:text-white">
                  {session?.user?.name || 'Admin User'}
                </p>
                <p className="text-sm text-gray dark:text-gray">
                  {session?.user?.email}
                </p>
              </div>
              
              <div className="p-2">
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors text-midnight_text dark:text-white"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Icon icon="ion:settings-outline" className="w-5 h-5" />
                  Settings
                </Link>
                
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors text-midnight_text dark:text-white"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Icon icon="ion:eye-outline" className="w-5 h-5" />
                  View Site
                </Link>
                
                <hr className="my-2 border-border dark:border-dark_border" />
                
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                >
                  <Icon icon="ion:log-out-outline" className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}