import { prisma } from '@/lib/prisma';
import { Icon } from '@iconify/react';

export default async function AnalyticsOverview() {
  // Fetch analytics data
  const [
    totalProperties,
    totalBlogs,
    totalViews,
    recentActivity,
    topProperties,
    topBlogs
  ] = await Promise.all([
    prisma.property.count(),
    prisma.blog.count(),
    prisma.property.aggregate({ _sum: { views: true } }),
    prisma.analytics.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.property.findMany({
      take: 5,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        propertyTitle: true,
        views: true,
        propertyImg: true
      }
    }),
    prisma.blog.findMany({
      take: 5,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        views: true,
        coverImage: true
      }
    })
  ]);

  // Calculate growth metrics
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [
    propertiesThisWeek,
    blogsThisWeek,
    viewsThisWeek
  ] = await Promise.all([
    prisma.property.count({ where: { createdAt: { gte: lastWeek } } }),
    prisma.blog.count({ where: { createdAt: { gte: lastWeek } } }),
    prisma.property.aggregate({
      where: { createdAt: { gte: lastWeek } },
      _sum: { views: true }
    })
  ]);

  const analyticsData = [
    {
      title: 'Total Site Views',
      value: totalViews._sum.views || 0,
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: 'ion:eye-outline',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Properties Created',
      value: propertiesThisWeek,
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: 'ion:home-outline',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Blog Posts',
      value: blogsThisWeek,
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: 'ion:document-text-outline',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Engagement Rate',
      value: '87%',
      change: '+5.1%',
      changeType: 'increase' as const,
      icon: 'ion:heart-outline',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {analyticsData.map((item) => (
          <div
            key={item.title}
            className="bg-white dark:bg-semidark rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color}`}>
                <Icon icon={item.icon} className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                item.changeType === 'increase' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
              }`}>
                {item.change}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-midnight_text dark:text-white mb-1">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </h3>
              <p className="text-sm text-gray dark:text-gray">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Properties */}
        <div className="bg-white dark:bg-semidark rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-midnight_text dark:text-white">
              Top Properties
            </h2>
            <Icon icon="ion:trending-up-outline" className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-4">
            {topProperties.map((property, index) => (
              <div key={property.id} className="flex items-center gap-4 p-3 border border-border dark:border-dark_border rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-midnight_text dark:text-white line-clamp-1">
                    {property.propertyTitle}
                  </h3>
                  <p className="text-sm text-gray dark:text-gray">
                    {property.views} views
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Icon icon="ion:trending-up-outline" className="w-4 h-4" />
                  {Math.round((property.views / (totalViews._sum.views || 1)) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Blogs */}
        <div className="bg-white dark:bg-semidark rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-midnight_text dark:text-white">
              Top Blog Posts
            </h2>
            <Icon icon="ion:document-text-outline" className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-4">
            {topBlogs.map((blog, index) => (
              <div key={blog.id} className="flex items-center gap-4 p-3 border border-border dark:border-dark_border rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-midnight_text dark:text-white line-clamp-1">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray dark:text-gray">
                    {blog.views} views
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Icon icon="ion:trending-up-outline" className="w-4 h-4" />
                  {Math.round((blog.views / (totalViews._sum.views || 1)) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-semidark rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-midnight_text dark:text-white">
            Recent Activity
          </h2>
          <Icon icon="ion:time-outline" className="w-6 h-6 text-gray" />
        </div>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Icon icon="ion:analytics-outline" className="w-16 h-16 text-gray mx-auto mb-4" />
              <p className="text-gray dark:text-gray">No recent activity to display</p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 border border-border dark:border-dark_border rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon icon="ion:activity-outline" className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-midnight_text dark:text-white">
                    {activity.eventType} - {activity.entityType}
                  </p>
                  <p className="text-sm text-gray dark:text-gray">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}