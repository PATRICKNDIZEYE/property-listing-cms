import { prisma } from '@/lib/prisma';
import { Icon } from '@iconify/react';

export default async function StatsCards() {
  const [propertyCount, blogCount, publishedBlogs, featuredProperties] = await Promise.all([
    prisma.property.count(),
    prisma.blog.count(),
    prisma.blog.count({ where: { published: true } }),
    prisma.property.count({ where: { featured: true } }),
  ]);

  const stats = [
    {
      label: 'Total Properties',
      value: propertyCount,
      icon: 'ion:home',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Total Blogs',
      value: blogCount,
      icon: 'ion:document-text',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Published Blogs',
      value: publishedBlogs,
      icon: 'ion:checkmark-circle',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Featured Properties',
      value: featuredProperties,
      icon: 'ion:star',
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-semidark rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-4 rounded-xl`}>
                <Icon 
                  icon={stat.icon} 
                  className={stat.textColor} 
                  width={32} 
                  height={32} 
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray dark:text-gray mb-1 font-medium">
                {stat.label}
              </p>
              <p className="text-4xl font-bold text-midnight_text dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
          <div className={`h-1 ${stat.color}`}></div>
        </div>
      ))}
    </div>
  );
}

