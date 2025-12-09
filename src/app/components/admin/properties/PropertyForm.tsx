'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

interface PropertyFormData {
  propertyImg: string;
  propertyTitle: string;
  propertyPrice: string;
  category: string;
  categoryImg: string;
  rooms: number;
  bathrooms: number;
  location: string;
  livingArea: string;
  tag: string;
  check: boolean;
  status: string;
  type: string;
  beds: number;
  garages: number;
  region: string;
  name: string;
  slug: string;
  description: string;
  featured: boolean;
}

interface PropertyFormProps {
  propertyId?: string;
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyImg: '/images/properties/prop-1.jpg',
    propertyTitle: '',
    propertyPrice: '',
    category: 'apartment',
    categoryImg: '/images/property_option/apartment.svg',
    rooms: 0,
    bathrooms: 0,
    location: '',
    livingArea: '',
    tag: 'Buy',
    check: true,
    status: 'Buy',
    type: 'Apartment',
    beds: 0,
    garages: 0,
    region: 'north',
    name: '',
    slug: '',
    description: '',
    featured: false,
  });

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`);
      if (response.ok) {
        const property = await response.json();
        setFormData({
          propertyImg: property.propertyImg,
          propertyTitle: property.propertyTitle,
          propertyPrice: property.propertyPrice,
          category: property.category,
          categoryImg: property.categoryImg,
          rooms: property.rooms,
          bathrooms: property.bathrooms,
          location: property.location,
          livingArea: property.livingArea,
          tag: property.tag,
          check: property.check,
          status: property.status,
          type: property.type,
          beds: property.beds,
          garages: property.garages,
          region: property.region,
          name: property.name,
          slug: property.slug,
          description: property.description || '',
          featured: property.featured,
        });
        setImagePreview(property.propertyImg);
      }
    } catch (error) {
      toast.error('Failed to load property');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setImageLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      
      if (response.ok) {
        const imageUrl = data.image?.url || data.url;
        if (!imageUrl) {
          toast.error('Invalid response from server');
          return;
        }
        setFormData((prev) => ({
          ...prev,
          propertyImg: imageUrl,
        }));
        setImagePreview(imageUrl);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error uploading image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'propertyTitle') {
      const slug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: prev.slug || slug,
        name: prev.name || value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = propertyId
        ? `/api/admin/properties/${propertyId}`
        : '/api/admin/properties';
      const method = propertyId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(propertyId ? 'Property updated successfully' : 'Property created successfully');
        router.push('/admin/properties');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to save property');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error saving property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Icon icon="ion:information-circle-outline" width={28} height={28} />
            Basic Information
          </h2>
          <p className="text-blue-100 text-sm mt-1">Hillside Prime title, price, and basic details</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Hillside Prime Title *
              </label>
              <input
                type="text"
                name="propertyTitle"
                value={formData.propertyTitle}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                placeholder="Modern Apartment in Downtown"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Slug (Auto-generated)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white bg-gray-50 dark:bg-gray-800"
                placeholder="auto-generated-slug"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Price *
              </label>
              <input
                type="text"
                name="propertyPrice"
                value={formData.propertyPrice}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                placeholder="$500,000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                title="Select property category"
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                placeholder="Downtown, New York"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                title="Select property status"
              >
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
                <option value="Sell">Sell</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              placeholder="Detailed description of the property..."
            />
          </div>
        </div>
      </div>

      {/* Property Features Section */}
      <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Icon icon="ion:star-outline" width={28} height={28} />
            Property Features
          </h2>
          <p className="text-green-100 text-sm mt-1">Beds, bathrooms, garages and other features</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                name="beds"
                min="0"
                value={formData.beds}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-darkmode dark:text-white"
                title="Number of bedrooms"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                min="0"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-darkmode dark:text-white"
                title="Number of bathrooms"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Rooms
              </label>
              <input
                type="number"
                name="rooms"
                min="0"
                value={formData.rooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-darkmode dark:text-white"
                title="Number of rooms"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Garages
              </label>
              <input
                type="number"
                name="garages"
                min="0"
                value={formData.garages}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-darkmode dark:text-white"
                title="Number of garages"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Living Area (sq ft)
              </label>
              <input
                type="text"
                name="livingArea"
                value={formData.livingArea}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-darkmode dark:text-white"
                placeholder="2500 sq ft"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Region
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-darkmode dark:text-white"
                title="Select property region"
              >
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="central">Central</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-midnight_text dark:text-white mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-darkmode dark:text-white"
                title="Select property type"
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Commercial">Commercial</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 accent-green-500"
              />
              <span className="text-sm font-semibold text-midnight_text dark:text-white">
                Mark as Featured Property
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="check"
                checked={formData.check}
                onChange={handleChange}
                className="w-5 h-5 accent-green-500"
              />
              <span className="text-sm font-semibold text-midnight_text dark:text-white">
                Active / Publish
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Icon icon="ion:image-outline" width={28} height={28} />
            Property Image
          </h2>
          <p className="text-purple-100 text-sm mt-1">Main property display image</p>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            {imagePreview && (
              <div className="relative w-full h-64 bg-light dark:bg-darklight rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Property Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border dark:border-dark_border rounded-lg hover:border-primary transition-colors">
              <div className="space-y-3 text-center">
                <Icon icon="ion:cloud-upload-outline" width={48} height={48} className="mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-midnight_text dark:text-white">
                    Upload Property Image
                  </p>
                  <p className="text-xs text-gray dark:text-gray">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={imageLoading}
                className="hidden"
                aria-label="Property image upload"
                title="Choose property image"
              />
              <button
                type="button"
                onClick={() => document.getElementById('imageInput')?.click()}
                disabled={imageLoading}
                className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-sm"
              >
                {imageLoading ? 'Uploading...' : 'Choose Image'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 font-semibold flex items-center gap-2"
        >
          <Icon icon="ion:checkmark-circle-outline" width={20} height={20} />
          {loading ? 'Saving...' : propertyId ? 'Update Property' : 'Create Property'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-300 dark:bg-gray-700 text-midnight_text dark:text-white px-8 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-200 font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

