'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Icon } from '@iconify/react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: 'ion:grid-outline',
  },
  {
    label: 'Properties',
    href: '/admin/properties',
    icon: 'ion:home-outline',
  },
  {
    label: 'Blogs',
    href: '/admin/blogs',
    icon: 'ion:document-text-outline',
  },
  {
    label: 'Images',
    href: '/admin/images',
    icon: 'ion:images-outline',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: 'ion:settings-outline',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="w-64 bg-white dark:bg-semidark border-r border-border dark:border-dark_border min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-border dark:border-dark_border">
        <h1 className="text-2xl font-bold text-primary">Admin Portal</h1>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-midnight_text dark:text-white hover:bg-light dark:hover:bg-darklight'
                  }`}
                >
                  <Icon icon={item.icon} width={20} height={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border dark:border-dark_border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-midnight_text dark:text-white hover:bg-light dark:hover:bg-darklight transition-colors"
        >
          <Icon icon="ion:log-out-outline" width={20} height={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

