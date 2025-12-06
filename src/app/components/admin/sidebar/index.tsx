'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Icon } from '@iconify/react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: 'ion:grid',
  },
  {
    label: 'Properties',
    href: '/admin/properties',
    icon: 'ion:home',
  },
  {
    label: 'Blogs',
    href: '/admin/blogs',
    icon: 'ion:document-text',
  },
  {
    label: 'Images',
    href: '/admin/images',
    icon: 'ion:images',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: 'ion:settings',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="w-64 bg-white dark:bg-semidark border-r border-border dark:border-dark_border min-h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 border-b border-border dark:border-dark_border bg-gradient-to-r from-primary to-blue-600">
        <Link href="/admin" className="block">
          <h1 className="text-2xl font-bold text-white">Property CMS</h1>
          <p className="text-blue-100 text-sm mt-1">Admin Portal</p>
        </Link>
      </div>

      <nav className="p-4 mt-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-midnight_text dark:text-white hover:bg-light dark:hover:bg-darklight hover:shadow-sm'
                  }`}
                >
                  <Icon icon={item.icon} width={22} height={22} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border dark:border-dark_border bg-light dark:bg-darklight">
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-midnight_text dark:text-white hover:bg-white dark:hover:bg-semidark transition-colors"
        >
          <Icon icon="ion:arrow-back" width={20} height={20} />
          <span className="font-medium">View Site</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Icon icon="ion:log-out-outline" width={20} height={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

