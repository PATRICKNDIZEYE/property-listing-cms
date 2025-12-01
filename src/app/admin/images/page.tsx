import { Metadata } from 'next';
import ImageUpload from '@/app/components/admin/images/ImageUpload';
import ImageLibrary from '@/app/components/admin/images/ImageLibrary';

export const metadata: Metadata = {
  title: 'Image Management',
};

export default function ImagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-midnight_text dark:text-white mb-8">
        Image Library
      </h1>
      <div className="mb-8">
        <ImageUpload onUploadSuccess={() => window.location.reload()} />
      </div>
      <ImageLibrary />
    </div>
  );
}

