import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAdmin();

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A blog with this slug already exists' 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to process request' 
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
    const { title, slug, excerpt, content, coverImage, author, published, date } = body;

    // Check if blog exists
    const existing = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Check if slug is being changed and if new slug already exists
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Blog with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(author && { author }),
        ...(published !== undefined && { published }),
        ...(date && { date: new Date(date) }),
      },
    });

    return NextResponse.json(blog);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A blog with this slug already exists' 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to process request' 
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

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A blog with this slug already exists' 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to process request' 
    }, { status: 500 });
  }
}

