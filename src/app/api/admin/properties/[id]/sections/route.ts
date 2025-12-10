import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

// GET all sections for a property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();

    const sections = await prisma.propertySection.findMany({
      where: { propertyId: id },
      include: {
        images: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(sections);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch sections' 
    }, { status: 500 });
  }
}

// POST create a new section
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();

    const body = await request.json();
    const { name, description, order, imageIds } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Section name is required' },
        { status: 400 }
      );
    }

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Get max order if not provided
    let maxOrder = order;
    if (maxOrder === undefined) {
      const count = await prisma.propertySection.count({
        where: { propertyId: id },
      });
      maxOrder = count;
    }

    const section = await prisma.propertySection.create({
      data: {
        name,
        description,
        propertyId: id,
        order: maxOrder,
        ...(imageIds && imageIds.length > 0 && {
          images: {
            connect: imageIds.map((imageId: string) => ({ id: imageId })),
          },
        }),
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to create section' 
    }, { status: 500 });
  }
}
