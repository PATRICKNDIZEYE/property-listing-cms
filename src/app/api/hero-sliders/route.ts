import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    // Fallback to empty array if database is not available
    console.error('Database error, using fallback data:', error);
    return NextResponse.json({ sliders: [] });
  }
}

