import { Metadata } from 'next';
import PropertyForm from '@/app/components/admin/properties/PropertyForm';

export const metadata: Metadata = {
  title: 'Edit Property',
};

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-midnight_text dark:text-white mb-8">
        Edit Property
      </h1>
      <PropertyForm propertyId={params.id} />
    </div>
  );
}

