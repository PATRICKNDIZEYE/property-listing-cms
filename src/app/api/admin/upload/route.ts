import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { saveImage } from '@/lib/image-upload';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const propertyId = formData.get('propertyId') as string | null;

    if (!file) {
      console.error('Upload error: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if file is actually a File object
    if (!(file instanceof File)) {
      console.error('Upload error: Invalid file object', typeof file);
      return NextResponse.json({ error: 'Invalid file object. Please try again.' }, { status: 400 });
    }

    // Validate file type
    if (!file.type || !file.type.startsWith('image/')) {
      console.error('Upload error: Invalid file type', file.type, 'File name:', file.name);
      return NextResponse.json({ error: 'Invalid file type. Please upload an image file (JPEG, PNG, WebP, GIF, or AVIF).' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('Upload error: File too large', file.size, 'bytes');
      return NextResponse.json({ error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 5MB limit.` }, { status: 400 });
    }

    if (!file.name) {
      console.error('Upload error: File has no name');
      return NextResponse.json({ error: 'File name is missing.' }, { status: 400 });
    }

    // Save image
    const imageUrl = await saveImage(file);

    // Save to database
    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        filename: file.name,
        path: imageUrl,
        mimeType: file.type,
        size: file.size,
        ...(propertyId && { propertyId }),
      },
    });

    return NextResponse.json({
      success: true,
      image: {
        id: image.id,
        url: image.url,
        filename: image.filename,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.message?.includes('Invalid image type') || error.message?.includes('Invalid file type')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.message?.includes('size exceeds') || error.message?.includes('File size')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to upload image' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: {
              id: true,
              propertyTitle: true,
            },
          },
        },
      }),
      prisma.image.count(),
    ]);

    return NextResponse.json({
      images,
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
      error: error.message || 'Failed to fetch images' 
    }, { status: 500 });
  }
}

