import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: 'Property slug is required' }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        images: {
          where: {
            sectionId: null, // Only get images not assigned to sections
          },
        },
        sections: {
          include: {
            images: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Transform to match expected format
    const formattedProperty = {
      id: property.id,
      property_img: property.propertyImg,
      property_title: property.propertyTitle,
      property_price: property.propertyPrice,
      category: property.category,
      category_img: property.categoryImg,
      rooms: property.rooms,
      bathrooms: property.bathrooms,
      location: property.location,
      livingArea: property.livingArea,
      tag: property.tag,
      check: property.check,
      status: property.status,
      type: property.type,
      beds: property.beds,
      garages: property.garages,
      region: property.region,
      name: property.name,
      slug: property.slug,
      description: property.description || '',
      featured: property.featured,
      images: property.images,
      sections: property.sections,
    };

    return NextResponse.json(formattedProperty);
  } catch (error: any) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch property' 
    }, { status: 500 });
  }
}
