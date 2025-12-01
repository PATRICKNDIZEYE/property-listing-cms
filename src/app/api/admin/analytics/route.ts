import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d, all

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    const [
      totalProperties,
      totalBlogs,
      publishedBlogs,
      featuredProperties,
      totalViews,
      propertyViews,
      blogViews,
      recentActivity,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.blog.count(),
      prisma.blog.count({ where: { published: true } }),
      prisma.property.count({ where: { featured: true } }),
      prisma.analytics.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      prisma.analytics.count({
        where: {
          eventType: 'property_view',
          createdAt: { gte: startDate },
        },
      }),
      prisma.analytics.count({
        where: {
          eventType: 'blog_view',
          createdAt: { gte: startDate },
        },
      }),
      prisma.analytics.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          // Note: We can't include related entities directly, but we can structure the response
        },
      }),
    ]);

    // Get views by day for the selected period
    const viewsByDay = await prisma.analytics.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate },
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      overview: {
        totalProperties,
        totalBlogs,
        publishedBlogs,
        featuredProperties,
        totalViews,
        propertyViews,
        blogViews,
      },
      viewsByDay: viewsByDay.map((item) => ({
        date: item.createdAt.toISOString().split('T')[0],
        count: item._count.id,
      })),
      recentActivity,
    });
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

