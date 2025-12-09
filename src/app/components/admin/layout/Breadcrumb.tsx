'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/admin' }
    ];

    // Skip 'admin' and 'dashboard' segments
    const relevantSegments = segments.slice(1).filter(segment => segment !== 'admin');

    let currentPath = '';
    
    relevantSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Format segment into readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      // Handle special cases
      const formattedLabel = label
        .replace('New', 'New')
        .replace('Edit', 'Edit')
        .replace('Id', 'ID');
        
      const isLast = index === relevantSegments.length - 1;
      
      breadcrumbs.push({
        label: formattedLabel,
        href: isLast ? undefined : `/admin${currentPath}`
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumb if only on dashboard
  if (pathname === '/admin') {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-gray dark:text-gray mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <Icon icon="ion:chevron-forward-outline" className="w-4 h-4 text-gray dark:text-gray" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-midnight_text dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-primary dark:text-primary font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}