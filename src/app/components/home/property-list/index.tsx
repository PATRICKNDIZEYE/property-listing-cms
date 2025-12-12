"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from './property-card';

const Listing = () => {
    const [properties, setProperties] = useState<any[]>([])
    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/propertydata')
        if (!res.ok) throw new Error('Failed to fetch')

        const data = await res.json()
        setProperties(data || [])
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }

    fetchData()
  }, [])
    return (
        <section className="bg-light dark:bg-semidark flex justify-center items-center py-16">
            <div className="lg:max-w-screen-xl md:max-w-screen-md mx-auto container px-4">
                <h1 className="text-4xl font-bold mb-12 text-midnight_text dark:text-white" data-aos="fade-up">Featured Hillside Prime</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {properties.slice(0, 4).map((property, index) => (
                        <div key={property.id} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                            <PropertyCard property={property} />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    <Link
                        href="/properties/properties-list"
                        className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-darkGreen transition-colors"
                    >
                        See More Properties
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Listing;