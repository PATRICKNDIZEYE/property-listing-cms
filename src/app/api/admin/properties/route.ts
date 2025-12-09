import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: true,
        },
      }),
      prisma.property.count(),
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch properties' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      propertyImg,
      propertyTitle,
      propertyPrice,
      category,
      categoryImg,
      rooms,
      bathrooms,
      location,
      livingArea,
      tag,
      check,
      status,
      type,
      beds,
      garages,
      region,
      name,
      slug,
      description,
      featured,
    } = body;

    // Validate required fields
    if (!propertyTitle || !slug || !propertyPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.property.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Property with this slug already exists' },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        propertyImg: propertyImg || '/images/properties/prop-1.jpg',
        propertyTitle,
        propertyPrice,
        category,
        categoryImg: categoryImg || `/images/property_option/${category}.svg`,
        rooms: parseInt(rooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        location,
        livingArea,
        tag,
        check: check ?? true,
        status,
        type,
        beds: parseInt(beds) || 0,
        garages: parseInt(garages) || 0,
        region,
        name,
        slug,
        description,
        featured: featured ?? false,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A property with this slug already exists' 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to create property' 
    }, { status: 500 });
  }
}

