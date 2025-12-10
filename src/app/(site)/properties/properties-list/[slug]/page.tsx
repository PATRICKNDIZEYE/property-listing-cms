"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import Image from 'next/image';
import CompanyInfo from '@/app/components/home/info';
import Availability from '@/app/components/property-details/availability';
import Tabbar from '@/app/components/property-details/tabbar';
import TextSection from '@/app/components/property-details/text-section';
import DiscoverProperties from '@/app/components/home/property-option';


export default function Details() {
  const { slug } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) return;
        
        const res = await fetch(`/api/properties/${slug}`)
        if (!res.ok) throw new Error('Failed to fetch')

        const data = await res.json()
        setItem(data)
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-midnight_text dark:text-white mb-2">Property Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/properties/properties-list", text: "Hillside Prime List" },
  ];

  // Combine all images: main image, general images, and section images
  const allImages = [
    item.property_img,
    ...(item.images || []).map((img: any) => img.url),
    ...(item.sections || []).flatMap((section: any) => 
      (section.images || []).map((img: any) => img.url)
    ),
  ].filter(Boolean);

  return (
    <div>
      <section className="bg-cover pt-36 pb-20 relative bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight overflow-x-hidden" >
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <h2 className="text-midnight_text text-4xl lg:text-[50px] leading-[1.2] md:mx-auto md:max-w-60% text-center relative font-bold dark:text-white"> {item?.property_title} </h2>
        </div>
      </section>
      <section>
        <div className='container mx-auto dark:bg-darkmode py-8'>
          <div className="h-[580px] max-w-5xl mx-auto w-full">
            {item?.property_img &&
              <Image
                src={item?.property_img}
                alt={item?.property_title}
                width={1000}
                height={600}
                className='h-full w-full object-cover rounded-lg'
              />}
          </div>
          
          {/* Additional Images Gallery */}
          {allImages.length > 1 && (
            <div className="max-w-5xl mx-auto mt-8">
              <h3 className="text-2xl font-bold text-midnight_text dark:text-white mb-4">Property Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allImages.slice(1).map((imageUrl: string, index: number) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={`${item.property_title} - Image ${index + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <TextSection description={item.description} />
      <CompanyInfo />
      <Tabbar sections={item.sections || []} />
      <Availability />
      <DiscoverProperties />
    </div>
  );
}
