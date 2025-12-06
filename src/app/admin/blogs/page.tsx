import { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import BlogList from '@/app/components/admin/blogs/BlogList';

export const metadata: Metadata = {
  title: 'Blogs Management',
};

export default function BlogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-midnight_text dark:text-white">
            Blogs Management
          </h1>
          <p className="text-gray dark:text-gray mt-1">
            Create and manage your blog posts
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
        >
          <Icon icon="ion:add-circle" width={20} height={20} />
          Add New Blog
        </Link>
      </div>
      <BlogList />
    </div>
  );
}

