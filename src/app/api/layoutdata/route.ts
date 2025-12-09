import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fallback header data
const fallbackHeaderData = [
  { label: "Home", href: "/" },
  { label: "Hillside Prime", href: "/properties/properties-list" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

export const GET = async () => {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: '1' },
    });

    let headerData = settings?.headerMenu 
      ? (settings.headerMenu as typeof fallbackHeaderData)
      : fallbackHeaderData;

    // Clean up menu if it contains documentation or template items
    if (Array.isArray(headerData)) {
      headerData = headerData
        .filter((item: any) => {
          // Remove documentation
          if (item.label?.toLowerCase() === 'documentation' || 
              item.href?.toLowerCase() === '/documentation') {
            return false;
          }
          // Remove template items with hardcoded slugs
          if (item.href?.includes('modern-apartment') || 
              item.href?.includes('blog_1')) {
            return false;
          }
          return true;
        })
        .map((item: any) => {
          // Simplify Properties and Blogs to direct links if they have submenus
          if (item.label === 'Properties' && item.submenu) {
            return { label: 'Hillside Prime', href: '/properties/properties-list' };
          }
          if (item.label === 'Blogs' && item.submenu) {
            return { label: 'Blogs', href: '/blogs' };
          }
          // Clean submenus if they exist
          if (item.submenu && Array.isArray(item.submenu)) {
            const cleanedSubmenu = item.submenu.filter((subItem: any) => {
              return !subItem.href?.includes('modern-apartment') && 
                     !subItem.href?.includes('blog_1') &&
                     subItem.label?.toLowerCase() !== 'documentation';
            });
            // If submenu is empty or only has one item, make it a direct link
            if (cleanedSubmenu.length <= 1) {
              return cleanedSubmenu.length === 1 
                ? { label: item.label, href: cleanedSubmenu[0].href }
                : { label: item.label, href: item.href === '#' ? '/' : item.href };
            }
            return { ...item, submenu: cleanedSubmenu };
          }
          return item;
        });
    }

    // Return all public settings (no authentication required)
    return NextResponse.json({
      headerData,
      siteLogo: settings?.siteLogo || null,
      siteTitle: settings?.siteTitle || 'Hillside Prime',
      siteDescription: settings?.siteDescription || null,
      contactEmail: settings?.contactEmail || null,
      contactPhone: settings?.contactPhone || null,
      contactAddress: settings?.contactAddress || null,
      facebookUrl: settings?.facebookUrl || null,
      twitterUrl: settings?.twitterUrl || null,
      instagramUrl: settings?.instagramUrl || null,
      linkedinUrl: settings?.linkedinUrl || null,
    });
  } catch (error) {
    // Fallback to static data if database is not available
    console.error('Database error, using fallback data:', error);
    return NextResponse.json({
      headerData: fallbackHeaderData,
      siteLogo: null,
      siteTitle: 'Hillside Prime',
      siteDescription: null,
      contactEmail: null,
      contactPhone: null,
      contactAddress: 'Property Real estate 4263 Wilkinson Street Tennessee',
      facebookUrl: null,
      twitterUrl: null,
      instagramUrl: null,
      linkedinUrl: null,
    });
  }
};

