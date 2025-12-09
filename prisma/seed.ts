import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();

const properties = [
  {
    propertyImg: "/images/properties/prop-1.jpg",
    propertyTitle: "Modern Appartment",
    propertyPrice: "$150,000",
    category: "apartment",
    categoryImg: "/images/property_option/apartment.svg",
    rooms: 2,
    bathrooms: 1,
    location: "California",
    livingArea: "85m²",
    tag: "Sell",
    check: true,
    status: "Buy",
    type: "Apartment",
    beds: 2,
    garages: 0,
    region: "south",
    name: "Property 1",
    slug: "modern-apartment"
  },
  {
    propertyImg: "/images/properties/prop-2.jpg",
    propertyTitle: "City Appartment",
    propertyPrice: "$180,000",
    category: "apartment",
    categoryImg: "/images/property_option/apartment.svg",
    rooms: 3,
    bathrooms: 2,
    location: "Texas",
    livingArea: "110m²",
    tag: "Buy",
    check: true,
    status: "Buy",
    type: "Apartment",
    beds: 3,
    garages: 1,
    region: "north",
    name: "Property 2",
    slug: "city-apartment"
  },
  {
    propertyImg: "/images/properties/prop-3.jpg",
    propertyTitle: "Luxury Appartment",
    propertyPrice: "$220,000",
    category: "apartment",
    categoryImg: "/images/property_option/apartment.svg",
    rooms: 4,
    bathrooms: 3,
    location: "New York",
    livingArea: "140m²",
    tag: "Sell",
    check: true,
    status: "Buy",
    type: "Apartment",
    beds: 4,
    garages: 1,
    region: "east",
    name: "Property 3",
    slug: "luxury-apartment"
  },
  {
    propertyImg: "/images/properties/prop-4.jpg",
    propertyTitle: "Mithra Villa",
    propertyPrice: "$200,000",
    category: "villa",
    categoryImg: "/images/property_option/villa.svg",
    rooms: 3,
    bathrooms: 2,
    location: "Florida",
    livingArea: "190m²",
    tag: "Buy",
    check: true,
    status: "Buy",
    type: "House",
    beds: 3,
    garages: 1,
    region: "north",
    name: "Property 4",
    slug: "mithra-villa"
  },
  {
    propertyImg: "/images/properties/prop-5.jpg",
    propertyTitle: "Palm Villa",
    propertyPrice: "$250,000",
    category: "villa",
    categoryImg: "/images/property_option/villa.svg",
    rooms: 4,
    bathrooms: 3,
    location: "Illinois",
    livingArea: "210m²",
    tag: "Sell",
    check: false,
    status: "Buy",
    type: "House",
    beds: 4,
    garages: 2,
    region: "west",
    name: "Property 5",
    slug: "palm-villa"
  },
  {
    propertyImg: "/images/properties/prop-6.jpg",
    propertyTitle: "Sunset Villa",
    propertyPrice: "$275,000",
    category: "villa",
    categoryImg: "/images/property_option/villa.svg",
    rooms: 5,
    bathrooms: 4,
    location: "California",
    livingArea: "250m²",
    tag: "Buy",
    check: true,
    status: "Buy",
    type: "House",
    beds: 5,
    garages: 2,
    region: "south",
    name: "Property 6",
    slug: "sunset-villa"
  },
  {
    propertyImg: "/images/properties/prop-7.jpg",
    propertyTitle: "Downtown Office",
    propertyPrice: "$320,000",
    category: "office",
    categoryImg: "/images/property_option/office.svg",
    rooms: 6,
    bathrooms: 2,
    location: "Texas",
    livingArea: "300m²",
    tag: "Sell",
    check: true,
    status: "Buy",
    type: "Commercial",
    beds: 2,
    garages: 2,
    region: "central",
    name: "Property 7",
    slug: "downtown-office"
  },
  {
    propertyImg: "/images/properties/prop-8.jpg",
    propertyTitle: "IT Office Space",
    propertyPrice: "$400,000",
    category: "office",
    categoryImg: "/images/property_option/office.svg",
    rooms: 10,
    bathrooms: 4,
    location: "New York",
    livingArea: "500m²",
    tag: "Buy",
    check: true,
    status: "Buy",
    type: "Commercial",
    beds: 2,
    garages: 4,
    region: "north",
    name: "Property 8",
    slug: "it-office-space"
  },
  {
    propertyImg: "/images/properties/prop-9.jpg",
    propertyTitle: "Startup Hub",
    propertyPrice: "$350,000",
    category: "office",
    categoryImg: "/images/property_option/office.svg",
    rooms: 8,
    bathrooms: 3,
    location: "Florida",
    livingArea: "420m²",
    tag: "Sell",
    check: true,
    status: "Buy",
    type: "Commercial",
    beds: 1,
    garages: 3,
    region: "east",
    name: "Property 9",
    slug: "startup-hub"
  },
  {
    propertyImg: "/images/properties/prop-10.jpg",
    propertyTitle: "Retail Shop",
    propertyPrice: "$120,000",
    category: "shop",
    categoryImg: "/images/property_option/shop.svg",
    rooms: 2,
    bathrooms: 1,
    location: "Illinois",
    livingArea: "60m²",
    tag: "Buy",
    check: true,
    status: "Buy",
    type: "Commercial",
    beds: 1,
    garages: 0,
    region: "west",
    name: "Property 10",
    slug: "retail-shop"
  },
  {
    propertyImg: "/images/properties/prop-11.jpg",
    propertyTitle: "Corner Store",
    propertyPrice: "$140,000",
    category: "shop",
    categoryImg: "/images/property_option/shop.svg",
    rooms: 3,
    bathrooms: 1,
    location: "California",
    livingArea: "75m²",
    tag: "Sell",
    check: true,
    status: "Buy",
    type: "Commercial",
    beds: 3,
    garages: 1,
    region: "south",
    name: "Property 11",
    slug: "corner-store"
  },
  {
    propertyImg: "/images/properties/prop-12.jpg",
    propertyTitle: "Shopping Unit",
    propertyPrice: "$160,000",
    category: "shop",
    categoryImg: "/images/property_option/shop.svg",
    rooms: 4,
    bathrooms: 1,
    location: "Texas",
    livingArea: "90m²",
    tag: "Buy",
    check: true,
    status: "Buy",
    type: "Commercial",
    beds: 1,
    garages: 1,
    region: "east",
    name: "Property 12",
    slug: "shopping-unit"
  },
  {
    propertyImg: "/images/properties/prop-13.jpg",
    propertyTitle: "Classic House",
    propertyPrice: "$180,000",
    category: "house",
    categoryImg: "/images/property_option/house.svg",
    rooms: 4,
    bathrooms: 2,
    location: "New York",
    livingArea: "160m²",
    tag: "Sell",
    check: true,
    status: "Buy",
    type: "House",
    beds: 4,
    garages: 1,
    region: "north",
    name: "Property 13",
    slug: "classic-house"
  },
  {
    propertyImg: "/images/properties/prop-14.jpg",
    propertyTitle: "Family House",
    propertyPrice: "$190,000",
    category: "house",
    categoryImg: "/images/property_option/house.svg",
    rooms: 5,
    bathrooms: 3,
    location: "Florida",
    livingArea: "180m²",
    tag: "Buy",
    check: true,
    status: "Buy",
    type: "House",
    beds: 5,
    garages: 1,
    region: "west",
    name: "Property 14",
    slug: "family-house"
  },
  {
    propertyImg: "/images/properties/prop-15.jpg",
    propertyTitle: "Compact House",
    propertyPrice: "$160,000",
    category: "house",
    categoryImg: "/images/property_option/house.svg",
    rooms: 3,
    bathrooms: 2,
    location: "Illinois",
    livingArea: "120m²",
    tag: "Sell",
    check: true,
    status: "Buy",
    type: "House",
    beds: 3,
    garages: 1,
    region: "south",
    name: "Property 15",
    slug: "compact-house"
  },
  {
    propertyImg: "/images/properties/prop-16.jpg",
    propertyTitle: "Industrial Warehouse",
    propertyPrice: "$500,000",
    category: "warehouse",
    categoryImg: "/images/property_option/warehouse.svg",
    rooms: 2,
    bathrooms: 1,
    location: "California",
    livingArea: "1000m²",
    tag: "Buy",
    check: true,
    status: "Buy",
    type: "Commercial",
    beds: 2,
    garages: 2,
    region: "central",
    name: "Property 16",
    slug: "industrial-warehouse"
  },
  {
    propertyImg: "/images/properties/prop-17.jpg",
    propertyTitle: "Storage Unit",
    propertyPrice: "$450,000",
    category: "warehouse",
    categoryImg: "/images/property_option/warehouse.svg",
    rooms: 1,
    bathrooms: 1,
    location: "Texas",
    livingArea: "800m²",
    tag: "Buy",
    check: true,
    status: "Buy",
    type: "Commercial",
    beds: 4,
    garages: 1,
    region: "north",
    name: "Property 17",
    slug: "storage-unit"
  },
  {
    propertyImg: "/images/properties/prop-18.jpg",
    propertyTitle: "Logistics Hub",
    propertyPrice: "$600,000",
    category: "warehouse",
    categoryImg: "/images/property_option/warehouse.svg",
    rooms: 3,
    bathrooms: 2,
    location: "New York",
    livingArea: "1200m²",
    tag: "Buy",
    check: true,
    status: "Buy",
    type: "Commercial",
    beds: 5,
    garages: 3,
    region: "east",
    name: "Property 18",
    slug: "logistics-hub"
  }
];

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);

  // Create properties
  console.log('Creating properties...');
  for (const property of properties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: {},
      create: property,
    });
  }
  console.log(`Created ${properties.length} properties`);

  // Seed blogs from markdown files in /markdown/blogs (if present)
  try {
    const blogsDir = path.join(__dirname, '../markdown/blogs');
    const files = await fs.readdir(blogsDir);
    const mdFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    console.log(`Found ${mdFiles.length} blog files to seed.`);

    for (const file of mdFiles) {
      try {
        const filePath = path.join(blogsDir, file);
        const raw = await fs.readFile(filePath, 'utf-8');
        const parsed = matter(raw);
        const fm = parsed.data as any;
        const content = parsed.content || '';

        const slugFromName = file.replace(/\.(md|mdx)$/, '');
        const slug = (fm.slug as string) || slugFromName;
        const title = (fm.title as string) || slugFromName.replace(/_/g, ' ');
        const excerpt = (fm.excerpt as string) || (content.substring(0, 200) + '...');
        const coverImage = (fm.coverImage as string) || null;
        const author = (fm.author as string) || 'Admin';
        const published = typeof fm.published === 'boolean' ? fm.published : true;
        const date = fm.date ? new Date(fm.date) : new Date();

        await prisma.blog.upsert({
          where: { slug },
          update: {},
          create: {
            title,
            slug,
            excerpt,
            content,
            coverImage,
            author,
            published,
            date,
          },
        });
      } catch (err) {
        console.warn('Failed to seed blog file', file, err);
      }
    }

    console.log('Blog seeding completed.');
  } catch (err) {
    // Ensure we don't reference properties that TypeScript can't statically verify on unknown error objects
    console.log('No markdown blog files found or failed to read directory.', (err as any)?.message ?? String(err));
  }

  // Create default site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      siteTitle: 'Hillside Prime',
      siteDescription: 'Your trusted property listing platform',
      headerMenu: [
        { label: 'Home', href: '/' },
        { label: 'Properties', href: '/properties/properties-list' },
        { label: 'Blogs', href: '/blogs' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  });

  console.log('Site settings created');

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

