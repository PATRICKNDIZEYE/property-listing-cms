import { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import PropertyForm from '@/app/components/admin/properties/PropertyForm';

export const metadata: Metadata = {
  title: 'Create New Property',
};

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/properties"
          className="p-2 hover:bg-light dark:hover:bg-darklight rounded-lg transition-colors"
        >
          <Icon icon="ion:arrow-back" width={24} height={24} className="text-midnight_text dark:text-white" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-midnight_text dark:text-white">
            Create New Property
          </h1>
          <p className="text-gray dark:text-gray mt-1">
            Add a new property to your listings
          </p>
        </div>
      </div>
      <PropertyForm />
    </div>
  );
}

