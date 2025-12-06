"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

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
        toast.error("Failed to fetch images");
      }
    } catch (error) {
      toast.error("Error loading images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/upload/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Image deleted successfully");
        fetchImages();
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Error deleting image");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-semidark rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-midnight_text dark:text-white mb-6">
        All Images ({images.length})
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white dark:bg-darklight rounded-lg shadow-md hover:shadow-xl overflow-hidden group relative transition-all duration-300"
          >
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.filename}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                <button
                  onClick={() => copyToClipboard(image.url)}
                  className="p-3 bg-white rounded-lg text-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-lg"
                  title="Copy URL"
                >
                  <Icon icon="ion:copy" width={20} height={20} />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-3 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-all duration-200 shadow-lg"
                  title="Delete"
                >
                  <Icon icon="ion:trash" width={20} height={20} />
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
        <div className="text-center py-16">
          <Icon
            icon="ion:images-outline"
            className="mx-auto text-gray dark:text-gray mb-4"
            width={64}
            height={64}
          />
          <p className="text-gray dark:text-gray text-lg">No images found.</p>
          <p className="text-gray dark:text-gray text-sm mt-1">
            Upload your first image to get started!
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-2 bg-white dark:bg-semidark border border-border dark:border-dark_border rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-darklight transition-colors font-medium"
          >
            Previous
          </button>
          <span className="text-midnight_text dark:text-white flex items-center font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-6 py-2 bg-white dark:bg-semidark border border-border dark:border-dark_border rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-darklight transition-colors font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
