import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default async function RecentActivity() {
  // Provide safe defaults so the dashboard still renders if the database is unreachable
  let recentProperties: Array<{
    id: string;
    propertyTitle: string;
    slug: string;
    propertyPrice: string;
    category: string;
    createdAt: Date;
  }> = [];
  let recentBlogs: Array<{
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: Date;
  }> = [];

  try {
    [recentProperties, recentBlogs] = await Promise.all([
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
  } catch (error) {
    // Database is unreachable or another Prisma error occurred — log the error on the server
    // and continue with safe defaults so the admin UI remains usable.
    console.error('Database error in RecentActivity, using fallback data:', error);
    // leave the default values (empty arrays) so UI renders without crashing
  }

  return (
    <div className="bg-white dark:bg-semidark rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-midnight_text dark:text-white flex items-center gap-2">
            <Icon icon="ion:time-outline" className="w-6 h-6 text-primary" />
            Recent Activity
          </h2>
          <p className="text-sm text-gray dark:text-gray mt-1">
            Your latest properties and blogs
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Recent Properties Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="ion:home-outline" className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-midnight_text dark:text-white">Properties</h3>
          </div>
          {recentProperties.length > 0 ? (
            <ul className="space-y-2">
              {recentProperties.map((property) => (
                <li key={property.id}>
                  <Link
                    href={`/admin/properties/${property.id}`}
                    className="group flex items-center justify-between p-4 border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-blue-50/30 dark:from-blue-900/10 dark:to-blue-900/5 rounded-lg hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-midnight_text dark:text-white truncate group-hover:text-primary transition-colors">
                        {property.propertyTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                          {property.category}
                        </span>
                        <span className="text-xs text-gray dark:text-gray">
                          {property.propertyPrice}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray dark:text-gray ml-2 whitespace-nowrap">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 border border-dashed border-border dark:border-dark_border rounded-lg">
              <Icon icon="ion:home-outline" className="w-8 h-8 text-gray dark:text-gray mx-auto mb-2 opacity-50" />
              <p className="text-sm text-gray dark:text-gray">No properties yet</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-border dark:bg-dark_border"></div>

        {/* Recent Blogs Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="ion:document-text-outline" className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-midnight_text dark:text-white">Blogs</h3>
          </div>
          {recentBlogs.length > 0 ? (
            <ul className="space-y-2">
              {recentBlogs.map((blog) => (
                <li key={blog.id}>
                  <Link
                    href={`/admin/blogs/${blog.id}`}
                    className="group flex items-center justify-between p-4 border border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-green-50/30 dark:from-green-900/10 dark:to-green-900/5 rounded-lg hover:shadow-md hover:border-green-400 dark:hover:border-green-600 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-midnight_text dark:text-white truncate group-hover:text-primary transition-colors">
                        {blog.title}
                      </p>
                      <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded transition-all ${
                        blog.published 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {blog.published ? '✓ Published' : '○ Draft'}
                      </span>
                    </div>
                    <span className="text-xs text-gray dark:text-gray ml-2 whitespace-nowrap">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 border border-dashed border-border dark:border-dark_border rounded-lg">
              <Icon icon="ion:document-text-outline" className="w-8 h-8 text-gray dark:text-gray mx-auto mb-2 opacity-50" />
              <p className="text-sm text-gray dark:text-gray">No blogs yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

