import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function RecentActivity() {
  const [recentProperties, recentBlogs] = await Promise.all([
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        propertyTitle: true,
        slug: true,
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
        createdAt: true,
      },
    }),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-semidark p-6 rounded-lg shadow-property">
        <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-4">
          Recent Properties
        </h2>
        <ul className="space-y-3">
          {recentProperties.map((property) => (
            <li key={property.id}>
              <Link
                href={`/admin/properties/${property.id}/edit`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors"
              >
                <span className="text-midnight_text dark:text-white">
                  {property.propertyTitle}
                </span>
                <span className="text-sm text-gray dark:text-gray">
                  {new Date(property.createdAt).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white dark:bg-semidark p-6 rounded-lg shadow-property">
        <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-4">
          Recent Blogs
        </h2>
        <ul className="space-y-3">
          {recentBlogs.map((blog) => (
            <li key={blog.id}>
              <Link
                href={`/admin/blogs/${blog.id}/edit`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors"
              >
                <span className="text-midnight_text dark:text-white">{blog.title}</span>
                <span className="text-sm text-gray dark:text-gray">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

