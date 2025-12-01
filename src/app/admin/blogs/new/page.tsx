import { Metadata } from 'next';
import BlogForm from '@/app/components/admin/blogs/BlogForm';

export const metadata: Metadata = {
  title: 'Create New Blog',
};

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-midnight_text dark:text-white mb-8">
        Create New Blog
      </h1>
      <BlogForm />
    </div>
  );
}

