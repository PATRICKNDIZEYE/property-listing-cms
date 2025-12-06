'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

      if (response.ok) {
        toast.success(propertyId ? 'Property updated successfully' : 'Property created successfully');
        router.push('/admin/properties');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save property');
      }
    } catch (error) {
      toast.error('Error saving property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-semidark p-8 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Property Title *
          </label>
          <input
            type="text"
            name="propertyTitle"
            value={formData.propertyTitle}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Price *
          </label>
          <input
            type="text"
            name="propertyPrice"
            value={formData.propertyPrice}
            onChange={handleChange}
            required
            placeholder="$150,000"
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
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
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Region *
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          >
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
            <option value="central">Central</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Rooms
          </label>
          <input
            type="number"
            name="rooms"
            value={formData.rooms}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Bathrooms
          </label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Beds
          </label>
          <input
            type="number"
            name="beds"
            value={formData.beds}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Garages
          </label>
          <input
            type="number"
            name="garages"
            value={formData.garages}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Living Area
          </label>
          <input
            type="text"
            name="livingArea"
            value={formData.livingArea}
            onChange={handleChange}
            placeholder="85m²"
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          >
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Tag
          </label>
          <select
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          >
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Property Image URL
          </label>
          <input
            type="text"
            name="propertyImg"
            value={formData.propertyImg}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="check"
            checked={formData.check}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-midnight_text dark:text-white">
            Active
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-midnight_text dark:text-white">
            Featured
          </label>
        </div>
      </div>

      <div className="mt-8 flex gap-4 pt-6 border-t border-border dark:border-dark_border">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg font-medium"
        >
          {loading ? 'Saving...' : propertyId ? 'Update Property' : 'Create Property'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-transparent border border-border dark:border-dark_border text-midnight_text dark:text-white px-8 py-3 rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

