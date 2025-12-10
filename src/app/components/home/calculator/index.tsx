"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import "../../../../app/style/index.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { PropertyContext } from "@/context-api/PropertyContext";

export default function Calculator() {
  const router = useRouter();
  const { properties, updateFilter, filters } = useContext(PropertyContext)!;
  const [price, setPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [allPropertiesData, setAllPropertiesData] = useState<any[]>([]);
  const hasClearedFilter = useRef(false);

  // Clear price filter when component mounts (only once)
  useEffect(() => {
    if (!hasClearedFilter.current && filters?.minPrice) {
      updateFilter('minPrice', '');
      hasClearedFilter.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch properties and calculate min/max prices
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/propertydata');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        if (data && data.length > 0) {
          setAllPropertiesData(data);
          // Parse all prices and find min/max
          const prices = data.map((prop: any) => {
            // Remove currency symbols, commas, and spaces, then parse
            return parseInt(prop.property_price.replace(/[^0-9]/g, ''), 10) || 0;
          }).filter((p: number) => p > 0);
          
          if (prices.length > 0) {
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setMinPrice(min);
            setMaxPrice(max);
            // Set initial price to minimum (reset when component loads)
            setPrice(min);
          }
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Fallback values
        setMinPrice(1000000);
        setMaxPrice(500000000);
        if (price === 0) {
          setPrice(1000000);
        }
      }
    };

    fetchProperties();
  }, []);

  // Calculate available properties count using useMemo to prevent unnecessary recalculations
  const availableCount = useMemo(() => {
    if (!allPropertiesData || allPropertiesData.length === 0 || price === 0) {
      return 0;
    }
    return allPropertiesData.filter((prop: any) => {
      const propPrice = parseInt(prop.property_price.replace(/[^0-9]/g, ''), 10) || 0;
      return propPrice >= price;
    }).length;
  }, [price, allPropertiesData]);

  // Debounced price change handler to prevent shaking
  const handlePriceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(event.target.value);
    setPrice(newPrice);
  }, []);

  const formatRWF = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewProperties = () => {
    // Set the price filter and navigate
    updateFilter('minPrice', price.toString());
    router.push('/properties/properties-list');
  };

  return (
    <section className="dark:bg-darkmode">
      <div
        className="container px-4 lg:max-w-screen-xl md:max-w-screen-md mx-auto flex flex-col lg:flex-row gap-16 justify-between items-center"
        data-aos="fade-left"
      >
        <div className="max-w-37.5 px-0 mb-8 md:mb-0" data-aos="fade-right">
          <h2
            className="text-4xl mb-4 font-bold text-midnight_text dark:text-white"
            data-aos="fade-left"
          >
            Find Your Perfect Property
          </h2>
          <p className="text-xl text-gray mb-12" data-aos="fade-left">
            Set your budget and discover properties that match your financial goals. 
            Find the perfect home within your price range.
          </p>
          <div className="relative-container">
            <div className="main-div mb-16 pt-8">
              <div className="child-container flex w-full justify-between">
                <div
                  className="money-dot relative"
                  data-aos="fade-left"
                  data-aos-delay="100"
                >
                  <p className="text-3xl text-midnight_text dark:text-white">
                    {availableCount > 0 ? availableCount : '0'}
                  </p>
                  <p className="text-gray text-base">Properties Available</p>
                </div>
                <div
                  className="money-dot relative"
                  data-aos="fade-left"
                  data-aos-delay="200"
                >
                  <p className="text-3xl text-midnight_text dark:text-white">
                    {minPrice > 0 ? formatRWF(minPrice) : '0'}
                  </p>
                  <p className="text-gray text-base">Starting From</p>
                </div>
                <div
                  className="money-dot relative"
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  <p className="text-3xl text-midnight_text dark:text-white">
                    {maxPrice > 0 ? formatRWF(maxPrice) : '0'}
                  </p>
                  <p className="text-gray text-base">Up To</p>
                </div>
              </div>
            </div>
          </div>
          <div data-aos="fade-up">
            <button
              onClick={handleViewProperties}
              className="text-xl bg-primary py-3 px-8 text-white rounded-lg me-3 mb-2 border border-primary hover:bg-darkGreen"
            >
              View Properties
            </button>
            <Link
              href="/properties/properties-list"
              className="text-xl hover:bg-primary hover:text-white py-3 px-8 text-primary border border-primary rounded-lg me-3 mb-2 inline-block"
            >
              Browse All
            </Link>
          </div>
        </div>
        <div className="lg:w-auto w-full" data-aos="fade-right">
          <div className="bg-primary rounded-t-lg p-16 w-full">
            <p className="text-4xl text-white mb-6 font-bold flex items-center justify-center">
              Budget Finder
            </p>
            <div className="items-center justify-center mt-12">
              <p className="text-white flex items-center justify-center font-bold mb-2">
                YOUR BUDGET
              </p>
              <p className="mb-6 text-white flex items-center justify-center font-bold text-[50px] leading-[1.2] min-h-[60px]">
                {price > 0 ? `${formatRWF(price)} RWF` : '0 RWF'}
              </p>
              {minPrice > 0 && maxPrice > 0 && (
                <>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={Math.max(1, Math.floor((maxPrice - minPrice) / 1000))}
                    value={price}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-darkGreen rounded-lg appearance-none cursor-pointer transition-none"
                  />
                  <div className="flex justify-between text-sm text-white mt-2 font-bold">
                    <p>{formatRWF(minPrice)} RWF</p>
                    <p>{formatRWF(maxPrice)} RWF</p>
                  </div>
                </>
              )}
              {availableCount > 0 && (
                <>
                  <p className="text-white text-center mt-4 text-lg">
                    {availableCount} {availableCount === 1 ? 'property' : 'properties'} available from this budget
                  </p>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handleViewProperties}
                      className="text-sm bg-darkGreen hover:bg-primary text-white py-2 px-6 rounded-lg transition-colors duration-200 font-medium"
                    >
                      View Properties
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="p-4 bg-darkGreen text-white text-xl rounded-b-lg">
            <p className="text-center mb-1 opacity-70">Have Questions?</p>
            <Link
              href={"tel:+909 887 0980"}
              className="text-center font-bold inline-block w-full"
            >
              <span className="opacity-70 !font-normal">Call us : </span>+909
              887 0980
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
