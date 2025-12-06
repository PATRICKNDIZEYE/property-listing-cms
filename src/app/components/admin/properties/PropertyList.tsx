'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

interface Property {
  id: string;
  propertyTitle: string;
  propertyPrice: string;
  location: string;
  category: string;
  slug: string;
  featured: boolean;
  createdAt: string;
}

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/properties?page=${page}&limit=10`);
      const data = await response.json();

      if (response.ok) {
        setProperties(data.properties);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error('Failed to fetch properties');
      }
    } catch (error) {
      toast.error('Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Property deleted successfully');
        fetchProperties();
      } else {
        toast.error('Failed to delete property');
      }
    } catch (error) {
      toast.error('Error deleting property');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-darklight dark:to-darklight/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-dark_border">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-darklight/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-midnight_text dark:text-white">
                    {property.propertyTitle}
                  </div>
                  <div className="text-sm text-gray dark:text-gray">{property.slug}</div>
                </td>
                <td className="px-6 py-4 font-semibold text-midnight_text dark:text-white">
                  {property.propertyPrice}
                </td>
                <td className="px-6 py-4 text-midnight_text dark:text-white">
                  {property.location}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary capitalize">
                    {property.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {property.featured ? (
                    <Icon icon="ion:star" className="text-yellow-500" width={24} height={24} />
                  ) : (
                    <Icon icon="ion:star-outline" className="text-gray" width={24} height={24} />
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Icon icon="ion:create" width={20} height={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Icon icon="ion:trash" width={20} height={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {properties.length === 0 && (
        <div className="text-center py-16">
          <Icon icon="ion:home-outline" className="mx-auto text-gray dark:text-gray mb-4" width={64} height={64} />
          <p className="text-gray dark:text-gray text-lg">No properties found.</p>
          <p className="text-gray dark:text-gray text-sm mt-1">Create your first property to get started!</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-darklight border-t border-border dark:border-dark_border flex justify-between items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white dark:bg-semidark border border-border dark:border-dark_border rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-darklight transition-colors"
          >
            Previous
          </button>
          <span className="text-midnight_text dark:text-white font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white dark:bg-semidark border border-border dark:border-dark_border rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-darklight transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

