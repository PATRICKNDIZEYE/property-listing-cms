import { prisma } from '@/lib/prisma';
import { Icon } from '@iconify/react';

export default async function EnhancedStats() {
  // Provide safe defaults so the dashboard still renders if the database is unreachable
  let propertyCount = 0;
  let blogCount = 0;
  let publishedBlogs = 0;
  let featuredProperties = 0;
  let totalViews: { _sum: { views: number | null } } = { _sum: { views: 0 } };
  let recentProperties = 0;
  let recentBlogs = 0;

  try {
    [
      propertyCount,
      blogCount,
      publishedBlogs,
      featuredProperties,
      totalViews,
      recentProperties,
      recentBlogs,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.blog.count(),
      prisma.blog.count({ where: { published: true } }),
      prisma.property.count({ where: { featured: true } }),
      prisma.property.aggregate({ _sum: { views: true } }),
      prisma.property.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.blog.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    ]);
  } catch (error) {
    // Database is unreachable or another Prisma error occurred — log the error on the server
    // and continue with safe defaults so the admin UI remains usable.
    // eslint-disable-next-line no-console
    console.error('Prisma error in EnhancedStats:', error);
    // leave the default values (zeros) so UI renders without crashing
  }

  // Calculate growth percentages
  const propertyGrowth = propertyCount > 0 ? ((recentProperties / propertyCount) * 100).toFixed(0) : 0;
  const blogGrowth = publishedBlogs > 0 ? ((recentBlogs / publishedBlogs) * 100).toFixed(0) : 0;

  const stats = [
    {
      label: 'Total Properties',
      value: propertyCount,
      change: recentProperties,
      growth: propertyGrowth,
      changeLabel: 'this week',
      icon: 'ion:home-outline',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200 dark:border-blue-800',
      trendIcon: 'ion:arrow-up-outline',
    },
    {
      label: 'Published Blogs',
      value: publishedBlogs,
      change: recentBlogs,
      growth: blogGrowth,
      changeLabel: 'this week',
      icon: 'ion:document-text-outline',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600',
      borderColor: 'border-green-200 dark:border-green-800',
      trendIcon: 'ion:arrow-up-outline',
    },
    {
      label: 'Featured Hillside Prime',
      value: featuredProperties,
      change: null,
      growth: null,
      changeLabel: '',
      icon: 'ion:star-outline',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      trendIcon: 'ion:star-outline',
    },
    {
      label: 'Total Views',
      value: totalViews._sum.views || 0,
      change: null,
      growth: null,
      changeLabel: '',
      icon: 'ion:eye-outline',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200 dark:border-purple-800',
      trendIcon: 'ion:eye-outline',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white dark:bg-semidark rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border ${stat.borderColor} hover:-translate-y-1`}
        >
          {/* Top Gradient Bar */}
          <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>

          <div className="p-6">
            {/* Header with Icon and Change Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <Icon 
                  icon={stat.icon} 
                  className={`${stat.textColor} w-6 h-6`}
                />
              </div>
              {stat.change !== null && stat.change > 0 && (
                <div className={`${stat.bgColor} ${stat.textColor} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
                  <Icon icon={stat.trendIcon} className="w-3 h-3" />
                  +{stat.growth}%
                </div>
              )}
            </div>

            {/* Main Content */}
            <div>
              <p className="text-sm text-gray dark:text-gray mb-2 font-medium">
                {stat.label}
              </p>
              <p className="text-4xl font-bold text-midnight_text dark:text-white mb-3">
                {stat.value.toLocaleString()}
              </p>
              
              {/* Change Info */}
              {stat.change !== null && (
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-6 bg-gradient-to-b ${stat.color} rounded-full`}></div>
                  <p className="text-xs text-gray dark:text-gray">
                    <span className={`font-semibold ${stat.textColor}`}>+{stat.change}</span> {stat.changeLabel}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className={`h-0.5 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        </div>
      ))}
    </div>
  );
}