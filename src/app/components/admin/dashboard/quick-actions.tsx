import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function QuickActions() {
  const actions = [
    {
      label: 'Add Property',
      href: '/admin/properties/new',
      icon: 'ion:add-circle',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      label: 'Write Blog',
      href: '/admin/blogs/new',
      icon: 'ion:create',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Upload Image',
      href: '/admin/images',
      icon: 'ion:cloud-upload',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      label: 'Site Settings',
      href: '/admin/settings',
      icon: 'ion:settings',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  return (
    <div className="bg-white dark:bg-semidark rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`${action.color} text-white p-6 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center gap-3`}
          >
            <Icon icon={action.icon} width={32} height={32} />
            <span className="font-medium text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

