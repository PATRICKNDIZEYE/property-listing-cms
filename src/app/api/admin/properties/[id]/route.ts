import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        images: true,
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if property exists
    const existing = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Check if slug is being changed and if new slug already exists
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.property.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Property with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const property = await prisma.property.update({
      where: { id: params.id },
      data: {
        ...(propertyImg && { propertyImg }),
        ...(propertyTitle && { propertyTitle }),
        ...(propertyPrice && { propertyPrice }),
        ...(category && { category }),
        ...(categoryImg && { categoryImg }),
        ...(rooms !== undefined && { rooms: parseInt(rooms) }),
        ...(bathrooms !== undefined && { bathrooms: parseInt(bathrooms) }),
        ...(location && { location }),
        ...(livingArea && { livingArea }),
        ...(tag && { tag }),
        ...(check !== undefined && { check }),
        ...(status && { status }),
        ...(type && { type }),
        ...(beds !== undefined && { beds: parseInt(beds) }),
        ...(garages !== undefined && { garages: parseInt(garages) }),
        ...(region && { region }),
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(featured !== undefined && { featured }),
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(property);
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    await prisma.property.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

