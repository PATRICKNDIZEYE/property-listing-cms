'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

interface InfoData {
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
}

export default function InfoManagement() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [formData, setFormData] = useState<InfoData>({
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
        });
        setLogoPreview(settings.siteLogo || '');
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setFormData((prev) => ({
          ...prev,
          siteLogo: url,
        }));
        setLogoPreview(url);
        toast.success('Logo uploaded successfully');
      } else {
        toast.error('Failed to upload logo');
      }
    } catch (error) {
      toast.error('Error uploading logo');
    } finally {
      setUploading(false);
    }
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
        toast.success('Information updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save information');
      }
    } catch (error) {
      toast.error('Error saving information');
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: 'ion:mail-outline', label: 'Email', key: 'contactEmail' },
    { icon: 'ion:call-outline', label: 'Phone', key: 'contactPhone' },
    { icon: 'ion:location-outline', label: 'Address', key: 'contactAddress' },
  ];

  const socialItems = [
    { icon: 'ion:logo-facebook', label: 'Facebook', key: 'facebookUrl', color: 'text-blue-600' },
    { icon: 'ion:logo-twitter', label: 'Twitter', key: 'twitterUrl', color: 'text-blue-400' },
    { icon: 'ion:logo-instagram', label: 'Instagram', key: 'instagramUrl', color: 'text-pink-600' },
    { icon: 'ion:logo-linkedin', label: 'LinkedIn', key: 'linkedinUrl', color: 'text-blue-700' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Site Branding Section */}
      <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Icon icon="ion:logo-ionitron" width={28} height={28} />
            Site Branding
          </h2>
          <p className="text-blue-100 text-sm mt-1">Manage your site's logo and identity</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo Upload */}
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border dark:border-dark_border rounded-lg hover:border-primary transition-colors">
              <div className="space-y-4 text-center w-full">
                {logoPreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 bg-light dark:bg-darklight rounded-lg overflow-hidden">
                      <Image
                        src={logoPreview}
                        alt="Logo Preview"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('logoInput')?.click()}
                      className="text-primary hover:text-blue-700 font-medium text-sm"
                    >
                      Change Logo
                    </button>
                  </div>
                ) : (
                  <div className="py-6">
                    <Icon icon="ion:image-outline" width={48} height={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-midnight_text dark:text-white">
                      Upload Logo
                    </p>
                    <p className="text-xs text-gray dark:text-gray mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
                <input
                  id="logoInput"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="hidden"
                  aria-label="Logo upload"
                  title="Choose logo file"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('logoInput')?.click()}
                  disabled={uploading}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-sm"
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </button>
              </div>
            </div>

            {/* Site Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Site Title
                </label>
                <input
                  type="text"
                  name="siteTitle"
                  value={formData.siteTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                  placeholder="Your website name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                  Site Description
                </label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                  placeholder="Brief description of your site"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Icon icon="ion:information-circle-outline" width={28} height={28} />
            Contact Information
          </h2>
          <p className="text-green-100 text-sm mt-1">How customers can reach you</p>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            {contactItems.map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2 flex items-center gap-2">
                  <Icon icon={item.icon} width={18} height={18} className="text-green-600" />
                  {item.label}
                </label>
                {item.key === 'contactAddress' ? (
                  <textarea
                    name={item.key}
                    value={formData[item.key as keyof InfoData]}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-darkmode dark:text-white"
                    placeholder={`Enter ${item.label.toLowerCase()}`}
                  />
                ) : (
                  <input
                    type={item.key === 'contactEmail' ? 'email' : 'text'}
                    name={item.key}
                    value={formData[item.key as keyof InfoData]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-darkmode dark:text-white"
                    placeholder={`Enter ${item.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Icon icon="ion:share-social-outline" width={28} height={28} />
            Social Media Links
          </h2>
          <p className="text-purple-100 text-sm mt-1">Connect your social media profiles</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialItems.map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2 flex items-center gap-2">
                  <Icon icon={item.icon} width={18} height={18} className={item.color} />
                  {item.label}
                </label>
                <input
                  type="url"
                  name={item.key}
                  value={formData[item.key as keyof InfoData]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-darkmode dark:text-white"
                  placeholder={`https://...`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 font-semibold flex items-center gap-2"
        >
          <Icon icon="ion:checkmark-circle-outline" width={20} height={20} />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
