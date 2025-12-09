import { Metadata } from 'next';
import InfoManagement from '@/app/components/admin/settings/InfoManagement';

export const metadata: Metadata = {
  title: 'Site Settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-midnight_text dark:text-white">
          Site Settings & Management
        </h1>
        <p className="text-gray dark:text-gray mt-1">
          Manage your site information, branding, and contact details
        </p>
      </div>
      <InfoManagement />
    </div>
  );
}

