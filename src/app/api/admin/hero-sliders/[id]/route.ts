import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAdmin();

    const slider = await prisma.heroSlider.findUnique({
      where: { id },
    });

    if (!slider) {
      return NextResponse.json({ error: 'Hero slider not found' }, { status: 404 });
    }

    return NextResponse.json(slider);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({
      error: error.message || 'Failed to fetch hero slider'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAdmin();

    const body = await request.json();
    const { imageUrl, section, order } = body;

    const slider = await prisma.heroSlider.findUnique({
      where: { id },
    });

    if (!slider) {
      return NextResponse.json({ error: 'Hero slider not found' }, { status: 404 });
    }

    // Validate section if provided
    if (section && section !== 'sell' && section !== 'buy') {
      return NextResponse.json(
        { error: 'Section must be either "sell" or "buy"' },
        { status: 400 }
      );
    }

    const updatedSlider = await prisma.heroSlider.update({
      where: { id },
      data: {
        ...(imageUrl && { imageUrl }),
        ...(section && { section }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedSlider);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({
      error: error.message || 'Failed to update hero slider'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAdmin();

    const slider = await prisma.heroSlider.findUnique({
      where: { id },
    });

    if (!slider) {
      return NextResponse.json({ error: 'Hero slider not found' }, { status: 404 });
    }

    // Delete the physical file from filesystem if it's in public/uploads
    try {
      if (slider.imageUrl.startsWith('/uploads/')) {
        const filePath = join(process.cwd(), 'public', slider.imageUrl.replace(/^\//, ''));
        await unlink(filePath);
      }
    } catch (fileError) {
      // Log but don't fail if file doesn't exist
      console.warn('Failed to delete slider image file:', fileError);
    }

    // Delete from database
    await prisma.heroSlider.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({
      error: error.message || 'Failed to delete hero slider'
    }, { status: 500 });
  }
}


