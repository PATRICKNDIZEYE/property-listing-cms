'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  createdAt: string;
  views: number;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/blogs?page=${page}&limit=10`);
      const data = await response.json();

      if (response.ok) {
        setBlogs(data.blogs);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error('Failed to fetch blogs');
      }
    } catch (error) {
      toast.error('Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } else {
        toast.error('Failed to delete blog');
      }
    } catch (error) {
      toast.error('Error deleting blog');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-semidark rounded-lg shadow-property overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-light dark:bg-darklight">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-midnight_text dark:text-white">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-midnight_text dark:text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-midnight_text dark:text-white">
                Views
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-midnight_text dark:text-white">
                Created
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-midnight_text dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-dark_border">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-light dark:hover:bg-darklight">
                <td className="px-6 py-4">
                  <div className="font-medium text-midnight_text dark:text-white">
                    {blog.title}
                  </div>
                  <div className="text-sm text-gray dark:text-gray">{blog.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      blog.published
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-midnight_text dark:text-white">
                  {blog.views}
                </td>
                <td className="px-6 py-4 text-midnight_text dark:text-white">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="p-2 text-primary hover:bg-primary/10 rounded"
                    >
                      <Icon icon="ion:create-outline" width={20} height={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Icon icon="ion:trash-outline" width={20} height={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-8 text-gray dark:text-gray">
          No blogs found. Create your first blog!
        </div>
      )}

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border dark:border-dark_border flex justify-between items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-border dark:border-dark_border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-midnight_text dark:text-white">
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

