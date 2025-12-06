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
    <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-darklight dark:to-darklight/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-midnight_text dark:text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-dark_border">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-darklight/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-midnight_text dark:text-white">
                    {blog.title}
                  </div>
                  <div className="text-sm text-gray dark:text-gray">{blog.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      blog.published
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-midnight_text dark:text-white">
                  {blog.views}
                </td>
                <td className="px-6 py-4 text-midnight_text dark:text-white">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Icon icon="ion:create" width={20} height={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
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

      {blogs.length === 0 && (
        <div className="text-center py-16">
          <Icon icon="ion:document-text-outline" className="mx-auto text-gray dark:text-gray mb-4" width={64} height={64} />
          <p className="text-gray dark:text-gray text-lg">No blogs found.</p>
          <p className="text-gray dark:text-gray text-sm mt-1">Create your first blog to get started!</p>
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

