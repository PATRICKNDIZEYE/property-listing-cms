import { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import BlogForm from '@/app/components/admin/blogs/BlogForm';

export const metadata: Metadata = {
  title: 'Edit Blog',
};

export default function EditBlogPage(props: any) {
  const { params } = props;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/blogs"
          className="p-2 hover:bg-light dark:hover:bg-darklight rounded-lg transition-colors"
        >
          <Icon icon="ion:arrow-back" width={24} height={24} className="text-midnight_text dark:text-white" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-midnight_text dark:text-white">
            Edit Blog
          </h1>
          <p className="text-gray dark:text-gray mt-1">
            Update your blog post
          </p>
        </div>
      </div>
      <BlogForm blogId={params.id} />
    </div>
  );
}

