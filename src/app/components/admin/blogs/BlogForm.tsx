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
  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
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
        if (blog.coverImage) {
          setImagePreview(blog.coverImage);
        }
      }
    } catch (error) {
      toast.error('Failed to load blog');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setImageLoading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      
      if (response.ok) {
        const imageUrl = data.image?.url || data.url;
        if (!imageUrl) {
          toast.error('Invalid response from server');
          return;
        }
        setFormData((prev) => ({
          ...prev,
          coverImage: imageUrl,
        }));
        setImagePreview(imageUrl);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error uploading image');
    } finally {
      setImageLoading(false);
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

      const data = await response.json();
      
      if (response.ok) {
        toast.success(blogId ? 'Blog updated successfully' : 'Blog created successfully');
        router.push('/admin/blogs');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to save blog');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error saving blog');
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

        <div>
          <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
            Cover Image
          </label>
          <div className="space-y-3">
            {imagePreview && (
              <div className="relative w-full h-48 border border-border dark:border-dark_border rounded-lg overflow-hidden bg-light dark:bg-darklight">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageLoading}
                  className="hidden"
                />
                <div className={`w-full px-4 py-3 border-2 border-dashed border-primary dark:border-primary rounded-lg text-center transition-colors ${
                  imageLoading 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                    : 'bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer'
                }`}>
                  {imageLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : imagePreview ? (
                    <span className="font-medium">Change Image</span>
                  ) : (
                    <span className="font-medium flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Click to Upload Image
                    </span>
                  )}
                </div>
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setFormData((prev) => ({ ...prev, coverImage: '' }));
                  }}
                  className="px-4 py-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

