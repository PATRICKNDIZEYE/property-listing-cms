import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default async function RecentActivity() {
  const [recentProperties, recentBlogs] = await Promise.all([
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        propertyTitle: true,
        slug: true,
        propertyPrice: true,
        category: true,
        createdAt: true,
      },
    }),
    prisma.blog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icon icon="ion:home" width={24} height={24} />
            Recent Properties
          </h2>
        </div>
        <div className="p-6">
          {recentProperties.length > 0 ? (
            <ul className="space-y-3">
              {recentProperties.map((property) => (
                <li key={property.id}>
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-light dark:hover:bg-darklight transition-all duration-200 border border-transparent hover:border-primary/20"
                  >
                    <div className="flex-1">
                      <span className="font-semibold text-midnight_text dark:text-white block">
                        {property.propertyTitle}
                      </span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {property.category}
                        </span>
                        <span className="text-sm text-gray dark:text-gray">
                          {property.propertyPrice}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray dark:text-gray">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray dark:text-gray py-8">No properties yet</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icon icon="ion:document-text" width={24} height={24} />
            Recent Blogs
          </h2>
        </div>
        <div className="p-6">
          {recentBlogs.length > 0 ? (
            <ul className="space-y-3">
              {recentBlogs.map((blog) => (
                <li key={blog.id}>
                  <Link
                    href={`/admin/blogs/${blog.id}/edit`}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-light dark:hover:bg-darklight transition-all duration-200 border border-transparent hover:border-primary/20"
                  >
                    <div className="flex-1">
                      <span className="font-semibold text-midnight_text dark:text-white block">
                        {blog.title}
                      </span>
                      <span className={`text-xs mt-1 inline-block px-2 py-1 rounded ${
                        blog.published 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <span className="text-xs text-gray dark:text-gray">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray dark:text-gray py-8">No blogs yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

