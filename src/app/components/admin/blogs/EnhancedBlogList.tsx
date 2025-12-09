'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  published: boolean;
  views: number;
  createdAt: string;
}

interface BlogListProps {
  blogs: Blog[];
}

export default function EnhancedBlogList({ blogs }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort blogs
  const filteredBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || 
                           (filterStatus === 'published' && blog.published) ||
                           (filterStatus === 'draft' && !blog.published);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Blog];
      const bValue = b[sortBy as keyof Blog];
      const order = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * order;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * order;
      }
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (published: boolean) => {
    return published ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
        Published
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400">
        Draft
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border dark:border-dark_border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-1">
              Blog Management
            </h2>
            <p className="text-sm text-gray dark:text-gray">
              Create, edit, and manage blog posts and content
            </p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Icon icon="ion:add-outline" className="w-5 h-5" />
            New Blog Post
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-border dark:border-dark_border bg-light dark:bg-darklight/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
              Search
            </label>
            <div className="relative">
              <Icon icon="ion:search-outline" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
              Status
            </label>
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                title="Filter blog status"
            >
              <option value="">All Posts</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
              Sort By
            </label>
            <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                title="Sort blog posts"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="views-desc">Most Viewed</option>
              <option value="views-asc">Least Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      <div className="p-6">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="ion:document-text-outline" className="w-16 h-16 text-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-midnight_text dark:text-white mb-2">
              No blog posts found
            </h3>
            <p className="text-gray dark:text-gray mb-4">
              {searchTerm || filterStatus 
                ? 'Try adjusting your filters' 
                : 'Get started by creating your first blog post'
              }
            </p>
            {!searchTerm && !filterStatus && (
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Icon icon="ion:add-outline" className="w-5 h-5" />
                Create Blog Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white dark:bg-darkmode border border-border dark:border-dark_border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Blog Image */}
                  <div className="lg:w-32 lg:h-24 w-full h-48 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={blog.coverImage || '/images/blog/blog-image.jpg'}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Blog Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-midnight_text dark:text-white text-lg mb-1 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray dark:text-gray text-sm line-clamp-2 mb-2">
                          {blog.excerpt || 'No excerpt available'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray dark:text-gray">
                          <span>By {blog.author}</span>
                          <span>•</span>
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Icon icon="ion:eye-outline" className="w-3 h-3" />
                            {blog.views} views
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getStatusBadge(blog.published)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 lg:flex-col lg:w-32">
                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex-1 lg:flex-initial"
                    >
                      <Icon icon="ion:create-outline" className="w-4 h-4" />
                      Edit
                    </Link>
                    <button 
                      className="px-4 py-2 border border-border dark:border-dark_border text-midnight_text dark:text-white rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors text-sm"
                      title="Delete blog"
                    >
                      <Icon icon="ion:trash-outline" className="w-4 h-4" />
                    </button>
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