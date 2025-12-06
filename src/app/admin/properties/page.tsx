import { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import PropertyList from '@/app/components/admin/properties/PropertyList';

export const metadata: Metadata = {
  title: 'Properties Management',
};

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-midnight_text dark:text-white">
            Properties Management
          </h1>
          <p className="text-gray dark:text-gray mt-1">
            Manage your property listings
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
        >
          <Icon icon="ion:add-circle" width={20} height={20} />
          Add New Property
        </Link>
      </div>
      <PropertyList />
    </div>
  );
}

