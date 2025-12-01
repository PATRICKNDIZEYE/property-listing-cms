import { Metadata } from 'next';
import PropertyForm from '@/app/components/admin/properties/PropertyForm';

export const metadata: Metadata = {
  title: 'Create New Property',
};

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-midnight_text dark:text-white mb-8">
        Create New Property
      </h1>
      <PropertyForm />
    </div>
  );
}

