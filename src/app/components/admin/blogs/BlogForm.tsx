'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  published: boolean;
  date: string;
}

interface BlogFormProps {
  blogId?: string;
}

export default function BlogForm({ blogId }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: 'Admin',
    published: false,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`);
      if (response.ok) {
        const blog = await response.json();
        setFormData({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt || '',
          content: blog.content,
          coverImage: blog.coverImage || '',
          author: blog.author || 'Admin',
          published: blog.published,
          date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      toast.error('Failed to load blog');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'title') {
      const slug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: prev.slug || slug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = blogId ? `/api/admin/blogs/${blogId}` : '/api/admin/blogs';
      const method = blogId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(blogId ? 'Blog updated successfully' : 'Blog created successfully');
        router.push('/admin/blogs');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save blog');
      }
    } catch (error) {
      toast.error('Error saving blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-semidark p-8 rounded-xl shadow-lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            title="Blog title"
            placeholder="Enter blog title"
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            title="URL-friendly slug"
            placeholder="blog-slug"
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            title="Brief excerpt of the blog post"
            placeholder="Enter a brief excerpt..."
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Content * (Markdown supported)
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={15}
            title="Blog content in Markdown format"
            placeholder="Write your blog content here. Markdown is supported."
            className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
              Cover Image URL
            </label>
            <input
              type="text"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              title="URL to cover image"
              placeholder="/images/blog/blog-image.jpg"
              className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              title="Author name"
              placeholder="Admin"
              className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              title="Publication date"
              placeholder="Select date"
              className="w-full px-4 py-3 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-8">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              title="Publish this blog post"
              className="w-4 h-4"
            />
            <label className="text-sm font-medium text-midnight_text dark:text-white">
              Publish
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4 pt-6 border-t border-border dark:border-dark_border">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg font-medium"
        >
          {loading ? 'Saving...' : blogId ? 'Update Blog' : 'Create Blog'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-transparent border border-border dark:border-dark_border text-midnight_text dark:text-white px-8 py-3 rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

