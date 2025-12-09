import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  context: any
) {
  const { params } = context;
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
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch property' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: any
) {
  const { params } = context;
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

    // Build update data object
    const updateData: any = {};
    
    if (propertyImg !== undefined) updateData.propertyImg = propertyImg;
    if (propertyTitle !== undefined) updateData.propertyTitle = propertyTitle;
    if (propertyPrice !== undefined) updateData.propertyPrice = propertyPrice;
    if (category !== undefined) updateData.category = category;
    if (categoryImg !== undefined) updateData.categoryImg = categoryImg;
    if (rooms !== undefined) updateData.rooms = parseInt(String(rooms)) || 0;
    if (bathrooms !== undefined) updateData.bathrooms = parseInt(String(bathrooms)) || 0;
    if (location !== undefined) updateData.location = location;
    if (livingArea !== undefined) updateData.livingArea = livingArea;
    if (tag !== undefined) updateData.tag = tag;
    if (check !== undefined) updateData.check = check;
    if (status !== undefined) updateData.status = status;
    if (type !== undefined) updateData.type = type;
    if (beds !== undefined) updateData.beds = parseInt(String(beds)) || 0;
    if (garages !== undefined) updateData.garages = parseInt(String(garages)) || 0;
    if (region !== undefined) updateData.region = region;
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (featured !== undefined) updateData.featured = featured;

    const property = await prisma.property.update({
      where: { id: params.id },
      data: updateData,
      include: {
        images: true,
      },
    });

    return NextResponse.json(property);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch property' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: any
) {
  const { params } = context;
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

    // Delete associated image files from filesystem
    for (const image of property.images) {
      try {
        const filePath = join(process.cwd(), 'public', image.path.replace(/^\//, ''));
        await unlink(filePath);
      } catch (fileError: any) {
        // Continue even if file deletion fails (file might not exist)
        if (fileError.code !== 'ENOENT') {
          // Only log non-ENOENT errors
          console.error('Error deleting image file:', fileError.message);
        }
      }
    }

    // Delete property (cascade will delete image records from database)
    await prisma.property.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Hillside Prime deleted successfully' });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to delete Hillside Prime' 
    }, { status: 500 });
  }
}

