import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const section = searchParams.get('section'); // 'sell' or 'buy'

    const where = section ? { section } : {};

    const sliders = await prisma.heroSlider.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ sliders });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Failed to fetch hero sliders'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { imageUrl, section, order } = body;

    // Validate required fields
    if (!imageUrl || !section) {
      return NextResponse.json(
        { error: 'Missing required fields: imageUrl and section are required' },
        { status: 400 }
      );
    }

    // Validate section
    if (section !== 'sell' && section !== 'buy') {
      return NextResponse.json(
        { error: 'Section must be either "sell" or "buy"' },
        { status: 400 }
      );
    }

    // Get the maximum order for the section if order is not provided
    const maxOrder = order !== undefined ? order : await prisma.heroSlider.count({
      where: { section },
    });

    const slider = await prisma.heroSlider.create({
      data: {
        imageUrl,
        section,
        order: maxOrder,
      },
    });

    return NextResponse.json(slider, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({
      error: error.message || 'Failed to create hero slider'
    }, { status: 500 });
  }
}



