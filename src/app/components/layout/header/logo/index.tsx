'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Logo: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch site settings for logo from public API
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/layoutdata');
        if (response.ok) {
          const data = await response.json();
          if (data.siteLogo) {
            setLogoUrl(data.siteLogo);
          }
        }
      } catch (error) {
        // Use default logo if fetch fails
      }
    };
    fetchLogo();
  }, []);

  // Use custom logo from settings if available, otherwise use default
  if (logoUrl) {
    return (
      <Link href="/">
        <Image
          src={logoUrl}
          alt="Hillside Prime"
          width={220}
          height={70}
          style={{ width: 'auto', height: 'auto', maxHeight: '70px' }}
          quality={100}
          className="object-contain"
        />
      </Link>
    );
  }

  return (
    <Link href="/">
      <Image
        src="/images/logo/logo.svg"
        alt="logo"
        width={220}
        height={70}
        style={{ width: 'auto', height: 'auto', maxHeight: '70px' }}
        quality={100}
        className='dark:hidden'
      />
      <Image
        src="/images/logo/logo-white.svg"
        alt="logo"
        width={220}
        height={70}
        style={{ width: 'auto', height: 'auto', maxHeight: '70px' }}
        quality={100}
        className='dark:block hidden'
      />
    </Link>
  );
};

export default Logo;