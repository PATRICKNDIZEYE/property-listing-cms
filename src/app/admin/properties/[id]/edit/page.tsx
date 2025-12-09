import { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import PropertyForm from '@/app/components/admin/properties/PropertyForm';

export const metadata: Metadata = {
  title: 'Edit Property',
};

export default function EditPropertyPage(props: any) {
  const { params } = props;
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
            Edit Property
          </h1>
          <p className="text-gray dark:text-gray mt-1">
            Update property information
          </p>
        </div>
      </div>
      <PropertyForm propertyId={params.id} />
    </div>
  );
}

