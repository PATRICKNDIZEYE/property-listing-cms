'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface SettingsData {
  siteTitle: string;
  siteDescription: string;
  siteLogo: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  footerText: string;
}

export default function SettingsForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SettingsData>({
    siteTitle: '',
    siteDescription: '',
    siteLogo: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    footerText: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const settings = await response.json();
        setFormData({
          siteTitle: settings.siteTitle || '',
          siteDescription: settings.siteDescription || '',
          siteLogo: settings.siteLogo || '',
          contactEmail: settings.contactEmail || '',
          contactPhone: settings.contactPhone || '',
          contactAddress: settings.contactAddress || '',
          facebookUrl: settings.facebookUrl || '',
          twitterUrl: settings.twitterUrl || '',
          instagramUrl: settings.instagramUrl || '',
          linkedinUrl: settings.linkedinUrl || '',
          seoTitle: settings.seoTitle || '',
          seoDescription: settings.seoDescription || '',
          seoKeywords: settings.seoKeywords || '',
          footerText: settings.footerText || '',
        });
      }
    } catch (error) {
      toast.error('Failed to load settings');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-semidark p-8 rounded-xl shadow-lg">
      <div className="space-y-8">
        <div className="pb-6 border-b border-border dark:border-dark_border">
          <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-1">
            General Settings
          </h2>
          <p className="text-sm text-gray dark:text-gray">Basic site information</p>
        </div>
        <div className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Site Title
              </label>
              <input
                type="text"
                name="siteTitle"
                value={formData.siteTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Site Description
              </label>
              <textarea
                name="siteDescription"
                value={formData.siteDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Site Logo URL
              </label>
              <input
                type="text"
                name="siteLogo"
                value={formData.siteLogo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="pb-6 border-b border-border dark:border-dark_border">
          <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-1">
            Contact Information
          </h2>
          <p className="text-sm text-gray dark:text-gray">How users can reach you</p>
        </div>
        <div className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Phone
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Address
              </label>
              <textarea
                name="contactAddress"
                value={formData.contactAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="pb-6 border-b border-border dark:border-dark_border">
          <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-1">
            Social Media
          </h2>
          <p className="text-sm text-gray dark:text-gray">Your social media profiles</p>
        </div>
        <div className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="pb-6 border-b border-border dark:border-dark_border">
          <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-1">
            SEO Settings
          </h2>
          <p className="text-sm text-gray dark:text-gray">Search engine optimization</p>
        </div>
        <div className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                SEO Title
              </label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                SEO Description
              </label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                SEO Keywords
              </label>
              <input
                type="text"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleChange}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="pb-6 border-b border-border dark:border-dark_border">
          <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-1">
            Footer
          </h2>
          <p className="text-sm text-gray dark:text-gray">Footer content</p>
        </div>
        <div className="pt-6">
          <div>
            <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
              Footer Text
            </label>
            <textarea
              name="footerText"
              value={formData.footerText}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border dark:border-dark_border">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg font-medium"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}

