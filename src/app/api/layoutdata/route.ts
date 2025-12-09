import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fallback header data
const fallbackHeaderData = [
  { label: "Home", href: "/" },
  {
    label: "Properties",
    href: "#",
    submenu: [
      { label: "Property List", href: "/properties/properties-list" },
      { label: "Property Details", href: "/properties/properties-list/modern-apartment" },
    ],
  },
  {
    label: "Blogs",
    href: "#",
    submenu: [
      { label: "Blog Grid", href: "/blogs" },
      { label: "Blog Details", href: "/blogs/blog_1" },
    ],
  },
  { label: "Contact", href: "/contact" },
  { label: "Documentation", href: "/documentation" },
];

export const GET = async () => {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: '1' },
    });

    const headerData = settings?.headerMenu 
      ? (settings.headerMenu as typeof fallbackHeaderData)
      : fallbackHeaderData;

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

