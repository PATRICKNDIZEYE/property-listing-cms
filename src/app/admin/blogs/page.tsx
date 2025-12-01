import { Metadata } from 'next';
import Link from 'next/link';
import BlogList from '@/app/components/admin/blogs/BlogList';

export const metadata: Metadata = {
  title: 'Blogs Management',
};

export default function BlogsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-midnight_text dark:text-white">
          Blogs
        </h1>
        <Link
          href="/admin/blogs/new"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Blog
        </Link>
      </div>
      <BlogList />
    </div>
  );
}

