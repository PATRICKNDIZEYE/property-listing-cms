'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

interface HeroSlider {
  id: string;
  imageUrl: string;
  section: 'sell' | 'buy';
  order: number;
}

export default function HeroSliderManagement() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell');
  const [sellSliders, setSellSliders] = useState<HeroSlider[]>([]);
  const [buySliders, setBuySliders] = useState<HeroSlider[]>([]);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const [sellResponse, buyResponse] = await Promise.all([
        fetch('/api/admin/hero-sliders?section=sell'),
        fetch('/api/admin/hero-sliders?section=buy'),
      ]);

      if (sellResponse.ok) {
        const sellData = await sellResponse.json();
        setSellSliders(sellData.sliders || []);
      }

      if (buyResponse.ok) {
        const buyData = await buyResponse.json();
        setBuySliders(buyData.sliders || []);
      }
    } catch (error) {
      toast.error('Failed to load hero sliders');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: 'sell' | 'buy') => {
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

    setUploading(section);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadResponse.ok) {
        const imageUrl = uploadData.image?.url || uploadData.url;
        if (!imageUrl) {
          toast.error('Invalid response from server');
          return;
        }

        // Create hero slider
        const createResponse = await fetch('/api/admin/hero-sliders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl,
            section,
            order: section === 'sell' ? sellSliders.length : buySliders.length,
          }),
        });

        if (createResponse.ok) {
          toast.success('Hero slider image uploaded successfully');
          await fetchSliders();
        } else {
          const errorData = await createResponse.json();
          toast.error(errorData.error || 'Failed to create hero slider');
        }
      } else {
        toast.error(uploadData.error || 'Failed to upload image');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error uploading image');
    } finally {
      setUploading(null);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string, section: 'sell' | 'buy') => {
    if (!confirm('Are you sure you want to delete this slider image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/hero-sliders/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Hero slider deleted successfully');
        await fetchSliders();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete hero slider');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error deleting hero slider');
    }
  };

  const handleOrderChange = async (id: string, newOrder: number, section: 'sell' | 'buy') => {
    try {
      const response = await fetch(`/api/admin/hero-sliders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      });

      if (response.ok) {
        await fetchSliders();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update order');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error updating order');
    }
  };

  const currentSliders = activeTab === 'sell' ? sellSliders : buySliders;

  return (
    <div className="bg-white dark:bg-semidark rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-midnight_text dark:text-white flex items-center gap-2">
            <Icon icon="ion:images-outline" className="w-6 h-6 text-primary" />
            Hero Section Sliders
          </h2>
          <p className="text-sm text-gray dark:text-gray mt-1">
            Manage background sliders for Sell and Buy sections on the homepage
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border dark:border-dark_border">
        <button
          onClick={() => setActiveTab('sell')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'sell'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray dark:text-gray hover:text-midnight_text dark:hover:text-white'
          }`}
        >
          Sell Section
        </button>
        <button
          onClick={() => setActiveTab('buy')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'buy'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray dark:text-gray hover:text-midnight_text dark:hover:text-white'
          }`}
        >
          Buy Section
        </button>
      </div>

      {/* Upload Section */}
      <div className="mb-6 p-4 bg-light dark:bg-darkmode rounded-lg border border-border dark:border-dark_border">
        <label className="block mb-2 text-sm font-semibold text-midnight_text dark:text-white">
          Upload New Slider Image ({activeTab === 'sell' ? 'Sell' : 'Buy'} Section)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, activeTab)}
          disabled={uploading === activeTab}
          className="block w-full text-sm text-gray dark:text-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-700 cursor-pointer"
        />
        {uploading === activeTab && (
          <p className="mt-2 text-sm text-primary">Uploading...</p>
        )}
      </div>

      {/* Sliders List */}
      <div>
        <h3 className="text-lg font-semibold text-midnight_text dark:text-white mb-4">
          Current Sliders ({currentSliders.length})
        </h3>

        {currentSliders.length === 0 ? (
          <div className="text-center py-12 bg-light dark:bg-darkmode rounded-lg border border-border dark:border-dark_border">
            <Icon icon="ion:image-outline" className="w-12 h-12 text-gray dark:text-gray mx-auto mb-3" />
            <p className="text-gray dark:text-gray">No slider images yet. Upload your first image above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSliders
              .sort((a, b) => a.order - b.order)
              .map((slider) => (
                <div
                  key={slider.id}
                  className="relative group bg-light dark:bg-darkmode rounded-lg border border-border dark:border-dark_border overflow-hidden"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={slider.imageUrl}
                      alt={`Hero slider ${slider.order + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDelete(slider.id, activeTab)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <Icon icon="ion:trash-outline" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray dark:text-gray">Order: {slider.order + 1}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOrderChange(slider.id, Math.max(0, slider.order - 1), activeTab)}
                          disabled={slider.order === 0}
                          className="p-1 text-gray dark:text-gray hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <Icon icon="ion:arrow-up-outline" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOrderChange(slider.id, slider.order + 1, activeTab)}
                          disabled={slider.order === currentSliders.length - 1}
                          className="p-1 text-gray dark:text-gray hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <Icon icon="ion:arrow-down-outline" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

