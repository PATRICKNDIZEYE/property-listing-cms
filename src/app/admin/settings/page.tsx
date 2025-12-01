import { Metadata } from 'next';
import SettingsForm from '@/app/components/admin/settings/SettingsForm';

export const metadata: Metadata = {
  title: 'Site Settings',
};

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-midnight_text dark:text-white mb-8">
        Site Settings
      </h1>
      <SettingsForm />
    </div>
  );
}

