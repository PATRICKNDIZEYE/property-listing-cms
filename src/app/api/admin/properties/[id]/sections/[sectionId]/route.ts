import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

// GET a specific section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    const { sectionId } = await params;
    await requireAdmin();

    const section = await prisma.propertySection.findUnique({
      where: { id: sectionId },
      include: {
        images: true,
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(section);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch section' 
    }, { status: 500 });
  }
}

// PUT update a section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    const { sectionId } = await params;
    await requireAdmin();

    const body = await request.json();
    const { name, description, order, imageIds } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;

    // Handle image connections
    if (imageIds !== undefined) {
      // First, disconnect all existing images
      await prisma.image.updateMany({
        where: { sectionId },
        data: { sectionId: null },
      });

      // Then connect new images
      if (imageIds.length > 0) {
        await prisma.image.updateMany({
          where: { id: { in: imageIds } },
          data: { sectionId },
        });
      }
    }

    const section = await prisma.propertySection.update({
      where: { id: sectionId },
      data: updateData,
      include: {
        images: true,
      },
    });

    return NextResponse.json(section);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to update section' 
    }, { status: 500 });
  }
}

// DELETE a section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    const { sectionId } = await params;
    await requireAdmin();

    await prisma.propertySection.delete({
      where: { id: sectionId },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Section deleted successfully' 
    });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to delete section' 
    }, { status: 500 });
  }
}
