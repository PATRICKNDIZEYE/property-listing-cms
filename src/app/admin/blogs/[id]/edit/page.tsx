import { Metadata } from 'next';
import BlogForm from '@/app/components/admin/blogs/BlogForm';

export const metadata: Metadata = {
  title: 'Edit Blog',
};

export default function EditBlogPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-midnight_text dark:text-white mb-8">
        Edit Blog
      </h1>
      <BlogForm blogId={params.id} />
    </div>
  );
}

