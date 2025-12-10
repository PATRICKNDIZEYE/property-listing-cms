'use client';
import { PropertyContext } from '@/context-api/PropertyContext';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

export default function DiscoverProperties() {
    const { properties, updateFilter } = useContext(PropertyContext)!;
    const [propertiesData, setPropertiesData] = useState<any[]>([])
    useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch('/api/propertydata');
            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();
            const categoryMap: Record<string, { category: string, category_img: string, count: number }> = {};

            // Only count properties where check is true (if it exists)
            data.forEach((item: any) => {
                // Filter by check property - only count if check is explicitly true
                // Skip if check is false, undefined, null, or any other value
                if (item.check !== true) return;
                
                if (categoryMap[item.category]) {
                    categoryMap[item.category].count += 1;
                } else {
                    categoryMap[item.category] = {
                        category: item.category,
                        category_img: item.category_img,
                        count: 1,
                    };
                }
            });

            const uniqueCategoryData = Object.values(categoryMap);
            
            // Define the desired order: house, apartment, villa, office, shop, warehouse
            const categoryOrder = ['house', 'apartment', 'villa', 'office', 'shop', 'warehouse'];
            
            // Create a lookup map (case-insensitive)
            const categoryLookup = new Map<string, typeof uniqueCategoryData[0]>();
            uniqueCategoryData.forEach(item => {
                const key = item.category.toLowerCase().trim();
                categoryLookup.set(key, item);
            });
            
            // Build the array in the exact order specified
            const sortedCategoryData = categoryOrder
                .map(categoryKey => categoryLookup.get(categoryKey))
                .filter((item): item is typeof uniqueCategoryData[0] => item !== undefined);
            
            // Add any remaining categories that weren't in the order list
            uniqueCategoryData.forEach(item => {
                const categoryLower = item.category.toLowerCase().trim();
                if (!categoryOrder.includes(categoryLower)) {
                    sortedCategoryData.push(item);
                }
            });
            
            setPropertiesData(sortedCategoryData);

        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    fetchData();
}, []);


    return (
        <section className='bg-light dark:bg-semidark'>
            <div className="container lg:max-w-screen-xl md:max-w-screen-md mx-auto px-4">
                <h2 className="text-4xl font-bold mb-12 text-midnight_text dark:text-white" data-aos="fade-left">Our Best listings</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-4 gap-8">
                    {propertiesData.map((property, index) => (
                        <div key={index} className="image-item block" onClick={() => updateFilter('category', property.category)} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                            <Link href={`/properties/properties-list`} className='group'>
                                <Image
                                    src={property.category_img}
                                    alt="Image"
                                    className='p-4 border-2 rounded-lg border-border dark:border-dark_border mb-6 group-hover:-translate-y-1 group-hover:duration-500 group-hover:border-primary dark:group-hover:border-primary transition-colors'
                                    height={85}
                                    width={85}
                                />
                                <p className="text-[22px] leading-[1.2] font-semibold mt-2 text-midnight_text text-opacity-80 group-hover:text-primary group-hover:text-opacity-100 dark:text-white dark:group-hover:text-primary dark:group-hover:text-opacity-100 dark:text-opacity-70 mb-1 capitalize transition-colors">{property.category}</p>
                                <p className="text-base text-gray group-hover:text-primary dark:group-hover:text-primary transition-colors">{property.count} Hillside Prime</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
