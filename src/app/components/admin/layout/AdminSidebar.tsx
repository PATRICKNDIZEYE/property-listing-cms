'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';

interface AdminSidebarProps {
  collapsed: boolean;
}

interface MenuItem {
  label: string;
  href?: string;
  icon: string;
  children?: MenuItem[];
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: 'ion:grid-outline',
  },
  {
    label: 'Content Management',
    icon: 'ion:document-text-outline',
    children: [
      {
        label: 'Properties',
        href: '/admin/properties',
        icon: 'ion:home-outline',
        badge: '12',
      },
      {
        label: 'Blogs',
        href: '/admin/blogs',
        icon: 'ion:book-outline',
        badge: '5',
      },
      {
        label: 'Pages',
        href: '/admin/pages',
        icon: 'ion:document-outline',
      },
    ],
  },
  {
    label: 'Media Library',
    href: '/admin/images',
    icon: 'ion:images-outline',
  },
  {
    label: 'User Management',
    icon: 'ion:people-outline',
    children: [
      {
        label: 'All Users',
        href: '/admin/users',
        icon: 'ion:people-circle-outline',
      },
      {
        label: 'Roles & Permissions',
        href: '/admin/roles',
        icon: 'ion:shield-checkmark-outline',
      },
    ],
  },
  {
    label: 'Analytics',
    icon: 'ion:analytics-outline',
    children: [
      {
        label: 'Overview',
        href: '/admin/analytics',
        icon: 'ion:pie-chart-outline',
      },
      {
        label: 'Property Views',
        href: '/admin/analytics/properties',
        icon: 'ion:eye-outline',
      },
      {
        label: 'Blog Performance',
        href: '/admin/analytics/blogs',
        icon: 'ion:trending-up-outline',
      },
    ],
  },
  {
    label: 'Site Management',
    icon: 'ion:settings-outline',
    children: [
      {
        label: 'General Settings',
        href: '/admin/settings',
        icon: 'ion:cog-outline',
      },
      {
        label: 'Navigation Menu',
        href: '/admin/navigation',
        icon: 'ion:menu-outline',
      },
      {
        label: 'SEO Settings',
        href: '/admin/seo',
        icon: 'ion:search-outline',
      },
      {
        label: 'Contact Forms',
        href: '/admin/forms',
        icon: 'ion:mail-outline',
      },
    ],
  },
  {
    label: 'Communication',
    icon: 'ion:chatbubbles-outline',
    children: [
      {
        label: 'Newsletter',
        href: '/admin/newsletter',
        icon: 'ion:mail-open-outline',
      },
      {
        label: 'Notifications',
        href: '/admin/notifications',
        icon: 'ion:notifications-outline',
        badge: '3',
      },
    ],
  },
  {
    label: 'System',
    icon: 'ion:hardware-chip-outline',
    children: [
      {
        label: 'Backup',
        href: '/admin/backup',
        icon: 'ion:cloud-upload-outline',
      },
      {
        label: 'Logs',
        href: '/admin/logs',
        icon: 'ion:document-text-outline',
      },
    ],
  },
];

export default function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Content Management']);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const active = isActive(item.href);

    return (
      <div key={item.label}>
        {item.href ? (
          <Link
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              active
                ? 'bg-primary text-white shadow-md'
                : 'text-midnight_text dark:text-white hover:bg-light dark:hover:bg-darklight hover:shadow-sm'
            } ${depth > 0 ? 'ml-6' : ''}`}
          >
            <Icon
              icon={item.icon}
              className={`w-5 h-5 ${active ? 'text-white' : 'text-midnight_text dark:text-white group-hover:text-primary'}`}
            />
            {!collapsed && (
              <>
                <span className="flex-1 font-medium text-sm">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    active 
                      ? 'bg-white/20 text-white' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ) : (
          <button
            onClick={() => !collapsed && toggleExpanded(item.label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-midnight_text dark:text-white hover:bg-light dark:hover:bg-darklight hover:shadow-sm ${
              depth > 0 ? 'ml-6' : ''
            }`}
            disabled={collapsed}
          >
            <Icon icon={item.icon} className="w-5 h-5" />
            {!collapsed && (
              <>
                <span className="flex-1 font-medium text-sm">{item.label}</span>
                <Icon
                  icon={isExpanded ? 'ion:chevron-up-outline' : 'ion:chevron-down-outline'}
                  className="w-4 h-4 transition-transform duration-200"
                />
              </>
            )}
          </button>
        )}

        {/* Children */}
        {hasChildren && !collapsed && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white dark:bg-semidark border-r border-border dark:border-dark_border shadow-xl z-50 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border dark:border-dark_border bg-gradient-to-r from-primary to-blue-600">
        <Link href="/admin" className="block">
          {!collapsed ? (
            <div>
              <h1 className="text-xl font-bold text-white">Property CMS</h1>
              <p className="text-blue-100 text-xs mt-1">Admin Portal</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <Icon icon="ion:home-outline" className="w-8 h-8 text-white" />
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border dark:border-dark_border bg-light dark:bg-darklight">
        {!collapsed ? (
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-midnight_text dark:text-white hover:bg-white dark:hover:bg-semidark transition-colors"
            >
              <Icon icon="ion:arrow-back-outline" className="w-5 h-5" />
              <span className="font-medium text-sm">View Site</span>
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <Link
              href="/"
              className="p-2 rounded-lg text-midnight_text dark:text-white hover:bg-white dark:hover:bg-semidark transition-colors"
            >
              <Icon icon="ion:arrow-back-outline" className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}