import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixMenu() {
  try {
    console.log('Checking database for menu items...');
    
    const settings = await prisma.siteSettings.findUnique({
      where: { id: '1' },
    });

    if (!settings) {
      console.log('No settings found. Creating new settings with clean menu...');
      await prisma.siteSettings.create({
        data: {
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
      console.log('✅ Created new settings with clean menu');
      return;
    }

    const currentMenu = settings.headerMenu as any[];
    
    if (!currentMenu || !Array.isArray(currentMenu)) {
      console.log('Menu is not an array. Updating to clean menu...');
      await prisma.siteSettings.update({
        where: { id: '1' },
        data: {
          headerMenu: [
            { label: 'Home', href: '/' },
            { label: 'Properties', href: '/properties/properties-list' },
            { label: 'Blogs', href: '/blogs' },
            { label: 'Contact', href: '/contact' },
          ],
        },
      });
      console.log('✅ Updated menu to clean version');
      return;
    }

    // Filter out documentation and clean up menu items
    const cleanedMenu = currentMenu
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
          return { label: 'Properties', href: '/properties/properties-list' };
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

    // Check if menu actually changed
    const menuChanged = JSON.stringify(currentMenu) !== JSON.stringify(cleanedMenu);

    if (menuChanged) {
      await prisma.siteSettings.update({
        where: { id: '1' },
        data: {
          headerMenu: cleanedMenu,
        },
      });
      console.log('✅ Updated menu in database');
      console.log('Before:', JSON.stringify(currentMenu, null, 2));
      console.log('After:', JSON.stringify(cleanedMenu, null, 2));
    } else {
      console.log('✅ Menu is already clean, no changes needed');
      console.log('Current menu:', JSON.stringify(currentMenu, null, 2));
    }
  } catch (error) {
    console.error('❌ Error fixing menu:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixMenu()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
