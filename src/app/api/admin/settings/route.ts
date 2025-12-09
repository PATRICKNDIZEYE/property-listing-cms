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
          siteTitle: 'Hillside Prime',
          siteDescription: 'Your trusted Hillside Prime listing platform',
          headerMenu: [
            { label: 'Home', href: '/' },
            { label: 'Hillside Prime', href: '/properties/properties-list' },
            { label: 'Blogs', href: '/blogs' },
            { label: 'Contact', href: '/contact' },
          ],
        },
      });
    } else {
      // Clean up menu if it contains documentation or template items
      const currentMenu = settings.headerMenu as any[];
      if (currentMenu && Array.isArray(currentMenu)) {
        const hasDocumentation = currentMenu.some((item: any) => 
          item.label?.toLowerCase() === 'documentation' || 
          item.href?.toLowerCase() === '/documentation' ||
          item.href?.includes('modern-apartment') ||
          item.href?.includes('blog_1')
        );

        if (hasDocumentation) {
          const cleanedMenu = currentMenu
            .filter((item: any) => {
              if (item.label?.toLowerCase() === 'documentation' || 
                  item.href?.toLowerCase() === '/documentation') {
                return false;
              }
              if (item.href?.includes('modern-apartment') || 
                  item.href?.includes('blog_1')) {
                return false;
              }
              return true;
            })
            .map((item: any) => {
              if (item.label === 'Properties' && item.submenu) {
                return { label: 'Hillside Prime', href: '/properties/properties-list' };
              }
              if (item.label === 'Blogs' && item.submenu) {
                return { label: 'Blogs', href: '/blogs' };
              }
              if (item.submenu && Array.isArray(item.submenu)) {
                const cleanedSubmenu = item.submenu.filter((subItem: any) => {
                  return !subItem.href?.includes('modern-apartment') && 
                         !subItem.href?.includes('blog_1') &&
                         subItem.label?.toLowerCase() !== 'documentation';
                });
                if (cleanedSubmenu.length <= 1) {
                  return cleanedSubmenu.length === 1 
                    ? { label: item.label, href: cleanedSubmenu[0].href }
                    : { label: item.label, href: item.href === '#' ? '/' : item.href };
                }
                return { ...item, submenu: cleanedSubmenu };
              }
              return item;
            });

          // Update database with cleaned menu
          settings = await prisma.siteSettings.update({
            where: { id: '1' },
            data: {
              headerMenu: cleanedMenu,
            },
          });
        }
      }
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch settings' 
    }, { status: 500 });
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
        siteTitle: siteTitle || 'Hillside Prime',
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
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch settings' 
    }, { status: 500 });
  }
}

