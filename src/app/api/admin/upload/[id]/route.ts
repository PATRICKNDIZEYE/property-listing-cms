import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
  request: NextRequest,
  context: any
) {
  const { params } = context;
  try {
    await requireAdmin();

    const image = await prisma.image.findUnique({
      where: { id: params.id },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete the physical file from filesystem
    try {
      const filePath = join(process.cwd(), 'public', image.path.replace(/^\//, ''));
      await unlink(filePath);
    } catch (fileError: any) {
      // Continue even if file deletion fails (file might not exist)
      if (fileError.code !== 'ENOENT') {
        // Only throw error for non-ENOENT errors (file not found is okay)
        throw new Error(`Failed to delete image file: ${fileError.message}`);
      }
    }

    // Delete from database
    await prisma.image.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to delete image' 
    }, { status: 500 });
  }
}

