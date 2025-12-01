import { Metadata } from 'next';
import Link from 'next/link';
import PropertyList from '@/app/components/admin/properties/PropertyList';

export const metadata: Metadata = {
  title: 'Properties Management',
};

export default function PropertiesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-midnight_text dark:text-white">
          Properties
        </h1>
        <Link
          href="/admin/properties/new"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Property
        </Link>
      </div>
      <PropertyList />
    </div>
  );
}

