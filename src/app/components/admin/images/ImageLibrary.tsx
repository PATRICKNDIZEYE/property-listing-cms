'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

interface ImageItem {
  id: string;
  url: string;
  filename: string;
  size: number;
  createdAt: string;
  property?: {
    id: string;
    propertyTitle: string;
  };
}

export default function ImageLibrary() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/upload?page=${page}&limit=20`);
      const data = await response.json();

      if (response.ok) {
        setImages(data.images);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error('Failed to fetch images');
      }
    } catch (error) {
      toast.error('Error loading images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/upload/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Image deleted successfully');
        fetchImages();
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      toast.error('Error deleting image');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white dark:bg-semidark rounded-lg shadow-property overflow-hidden group relative"
          >
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.filename}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyToClipboard(image.url)}
                  className="p-2 bg-white rounded text-primary hover:bg-primary hover:text-white transition-colors"
                  title="Copy URL"
                >
                  <Icon icon="ion:copy-outline" width={20} height={20} />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 bg-red-500 rounded text-white hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  <Icon icon="ion:trash-outline" width={20} height={20} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm text-midnight_text dark:text-white truncate">
                {image.filename}
              </p>
              {image.property && (
                <p className="text-xs text-gray dark:text-gray mt-1">
                  {image.property.propertyTitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-gray dark:text-gray">
          No images found. Upload your first image!
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-border dark:border-dark_border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-midnight_text dark:text-white flex items-center">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-border dark:border-dark_border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

