import { prisma } from '@/lib/prisma';

export default async function StatsCards() {
  const [propertyCount, blogCount, totalViews, recentProperties] = await Promise.all([
    prisma.property.count(),
    prisma.blog.count(),
    prisma.analytics.count({ where: { eventType: 'property_view' } }),
    prisma.property.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ]);

  const stats = [
    {
      label: 'Total Properties',
      value: propertyCount,
      icon: 'ion:home-outline',
      color: 'bg-blue-500',
    },
    {
      label: 'Total Blogs',
      value: blogCount,
      icon: 'ion:document-text-outline',
      color: 'bg-green-500',
    },
    {
      label: 'Total Views',
      value: totalViews,
      icon: 'ion:eye-outline',
      color: 'bg-purple-500',
    },
    {
      label: 'Featured Properties',
      value: recentProperties.length,
      icon: 'ion:star-outline',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-semidark p-6 rounded-lg shadow-property"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray dark:text-gray text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-midnight_text dark:text-white">
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <span className="text-white text-2xl">📊</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

