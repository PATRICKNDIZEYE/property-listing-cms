import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    let settings = await prisma.siteSettings.findUnique({
      where: { id: '1' },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: '1',
          siteTitle: 'Property',
          siteDescription: 'Your trusted property listing platform',
          headerMenu: [
            { label: 'Home', href: '/' },
            {
              label: 'Properties',
              href: '#',
              submenu: [
                { label: 'Property List', href: '/properties/properties-list' },
                { label: 'Property Details', href: '/properties/properties-list/modern-apartment' },
              ],
            },
            {
              label: 'Blogs',
              href: '#',
              submenu: [
                { label: 'Blog Grid', href: '/blogs' },
                { label: 'Blog Details', href: '/blogs/blog_1' },
              ],
            },
            { label: 'Contact', href: '/contact' },
            { label: 'Documentation', href: '/documentation' },
          ],
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      siteTitle,
      siteDescription,
      siteLogo,
      contactEmail,
      contactPhone,
      contactAddress,
      facebookUrl,
      twitterUrl,
      instagramUrl,
      linkedinUrl,
      seoTitle,
      seoDescription,
      seoKeywords,
      headerMenu,
      footerText,
    } = body;

    const settings = await prisma.siteSettings.upsert({
      where: { id: '1' },
      update: {
        ...(siteTitle !== undefined && { siteTitle }),
        ...(siteDescription !== undefined && { siteDescription }),
        ...(siteLogo !== undefined && { siteLogo }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(contactAddress !== undefined && { contactAddress }),
        ...(facebookUrl !== undefined && { facebookUrl }),
        ...(twitterUrl !== undefined && { twitterUrl }),
        ...(instagramUrl !== undefined && { instagramUrl }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(seoKeywords !== undefined && { seoKeywords }),
        ...(headerMenu !== undefined && { headerMenu }),
        ...(footerText !== undefined && { footerText }),
      },
      create: {
        id: '1',
        siteTitle: siteTitle || 'Property',
        siteDescription,
        siteLogo,
        contactEmail,
        contactPhone,
        contactAddress,
        facebookUrl,
        twitterUrl,
        instagramUrl,
        linkedinUrl,
        seoTitle,
        seoDescription,
        seoKeywords,
        headerMenu: headerMenu || [],
        footerText,
      },
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

