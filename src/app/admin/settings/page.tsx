import { Metadata } from 'next';
import SettingsForm from '@/app/components/admin/settings/SettingsForm';

export const metadata: Metadata = {
  title: 'Site Settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-midnight_text dark:text-white">
          Site Settings
        </h1>
        <p className="text-gray dark:text-gray mt-1">
          Configure your website settings
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}

