"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from 'react';
import { PropertyContext } from "@/context-api/PropertyContext";
import Slider from "react-slick";

interface HeroSlider {
  id: string;
  imageUrl: string;
  section: 'sell' | 'buy';
  order: number;
}

const Hero = () => {
  const router = useRouter();
  const [propertiesData, setPropertiesData] = useState<any[]>([])
  const { properties, updateFilter } = useContext(PropertyContext)!;
  const [activeTab, setActiveTab] = useState("sell");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useState("");
  const [error, setError] = useState('');
  const [sellSliders, setSellSliders] = useState<HeroSlider[]>([]);
  const [buySliders, setBuySliders] = useState<HeroSlider[]>([]);
  const sliderRef = useRef<Slider>(null);
  const [activePart, setActivePart] = useState<1 | 2>(1); // Part 1 = right, Part 2 = left

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/propertydata')
        if (!res.ok) throw new Error('Failed to fetch')

        const data = await res.json()
        setPropertiesData(data || [])
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const [sellResponse, buyResponse] = await Promise.all([
          fetch('/api/hero-sliders?section=sell'),
          fetch('/api/hero-sliders?section=buy'),
        ]);

        if (sellResponse.ok) {
          const sellData = await sellResponse.json();
          console.log('Sell sliders data:', sellData);
          setSellSliders(sellData.sliders || []);
        } else {
          setSellSliders([]);
        }

        if (buyResponse.ok) {
          const buyData = await buyResponse.json();
          console.log('Buy sliders data:', buyData);
          setBuySliders(buyData.sliders || []);
        } else {
          setBuySliders([]);
        }
      } catch (error) {
        console.error('Error fetching hero sliders:', error);
        // Set empty arrays on error to show fallback gradient
        setSellSliders([]);
        setBuySliders([]);
      }
    };

    fetchSliders();
  }, [])

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    // Reset slider to first slide when tab changes
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  };

  const currentSliders = activeTab === 'sell' ? sellSliders : buySliders;
  
  // Debug log
  console.log('Current sliders:', currentSliders.length, 'Active tab:', activeTab);

  // Reset slider when sliders change or tab changes
  useEffect(() => {
    if (sliderRef.current && currentSliders.length > 0) {
      // Small delay to ensure slider is ready
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.slickGoTo(0);
        }
      }, 100);
    }
  }, [currentSliders.length, activeTab]);

  // Auto-switch between Part 1 and Part 2 every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePart((prev) => (prev === 1 ? 2 : 1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: currentSliders.length > 1,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: currentSliders.length > 1,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    arrows: false,
    pauseOnHover: false,
    adaptiveHeight: false,
    lazyLoad: 'ondemand' as const,
  };

  // Imigongo pattern background (same for both light and dark mode - using light theme pattern)
  const imigongoPattern = "url(\"data:image/svg+xml,%3Csvg width='240' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='imigongo' x='0' y='0' width='240' height='240' patternUnits='userSpaceOnUse'%3E%3Cg opacity='0.1'%3E%3Cpath d='M120,120 L100,100 L120,80 L140,100 Z' fill='%231A1A1A'/%3E%3Cpath d='M120,120 L100,100 L120,140 L140,100 Z' fill='%231A1A1A'/%3E%3Cpath d='M120,120 L140,100 L120,80 L100,100 Z' fill='%231A1A1A'/%3E%3Cpath d='M120,120 L140,100 L120,140 L100,100 Z' fill='%231A1A1A'/%3E%3C/g%3E%3Cg opacity='0.09'%3E%3Cpath d='M80,80 L160,80 L160,160 L80,160 Z' fill='none' stroke='%231A1A1A' stroke-width='4'/%3E%3Cpath d='M60,60 L180,60 L180,180 L60,180 Z' fill='none' stroke='%231A1A1A' stroke-width='3.5'/%3E%3Cpath d='M40,40 L200,40 L200,200 L40,200 Z' fill='none' stroke='%231A1A1A' stroke-width='3'/%3E%3C/g%3E%3Cg opacity='0.11'%3E%3Cpath d='M0,0 L60,60 L0,120 L60,60 Z' fill='none' stroke='%231A1A1A' stroke-width='5'/%3E%3Cpath d='M240,0 L180,60 L240,120 L180,60 Z' fill='none' stroke='%231A1A1A' stroke-width='5'/%3E%3Cpath d='M0,240 L60,180 L0,120 L60,180 Z' fill='none' stroke='%231A1A1A' stroke-width='5'/%3E%3Cpath d='M240,240 L180,180 L240,120 L180,180 Z' fill='none' stroke='%231A1A1A' stroke-width='5'/%3E%3C/g%3E%3Cg opacity='0.08'%3E%3Cpath d='M0,0 L30,30 L60,0 L30,60 L0,60 L30,30 Z' fill='none' stroke='%231A1A1A' stroke-width='3.5'/%3E%3Cpath d='M240,0 L210,30 L180,0 L210,60 L240,60 L210,30 Z' fill='none' stroke='%231A1A1A' stroke-width='3.5'/%3E%3Cpath d='M0,240 L30,210 L60,240 L30,180 L0,180 L30,210 Z' fill='none' stroke='%231A1A1A' stroke-width='3.5'/%3E%3Cpath d='M240,240 L210,210 L180,240 L210,180 L240,180 L210,210 Z' fill='none' stroke='%231A1A1A' stroke-width='3.5'/%3E%3C/g%3E%3Cg opacity='0.07'%3E%3Cpath d='M0,120 L80,40 L160,120 L80,200 L0,120 Z' fill='none' stroke='%231A1A1A' stroke-width='3'/%3E%3Cpath d='M240,120 L160,40 L80,120 L160,200 L240,120 Z' fill='none' stroke='%231A1A1A' stroke-width='3'/%3E%3Cpath d='M120,0 L40,80 L120,160 L200,80 L120,0 Z' fill='none' stroke='%231A1A1A' stroke-width='3'/%3E%3Cpath d='M120,240 L40,160 L120,80 L200,160 L120,240 Z' fill='none' stroke='%231A1A1A' stroke-width='3'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23imigongo)'/%3E%3C/svg%3E\")";

  const handleSearchSell = () => {
    if (location.trim() === '') {
      setError('Please enter a location to search.');
      return;
    }
    setError('');
    updateFilter('location', location);
    updateFilter('tag', 'sell');
    router.push(`/properties/properties-list`);
  };

  const handleSearchBuy = () => {
    if (location.trim() === '') {
      setError('Please enter a location to search.');
      return;
    }
    setError('');
    updateFilter('location', location);
    updateFilter('tag', 'Buy');
    router.push(`/properties/properties-list`);
  };

  const suggestions = Array.from(new Set(propertiesData.map((item) => item.location)));

  const handleSelect = (value: any) => {
    setLocation(value);
    setShowSuggestions(false);
  };

  return (
    <section className="relative pt-44 pb-0 dark:bg-darklight overflow-x-hidden min-h-[600px]">
      {/* Full background imigongo pattern for dark mode */}
      <div 
        className="absolute inset-0 z-0 w-full h-full hidden dark:block"
        style={{
          backgroundImage: imigongoPattern,
          backgroundSize: '480px 480px',
          backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* Split-screen container */}
      <div className="absolute inset-0 z-0 w-full h-full flex">
        {/* Part 1 - Right Side */}
        <div 
          className={`relative w-1/2 h-full ${
            activePart === 1 ? 'z-10' : 'z-0'
          }`}
        >
          {activePart === 1 && currentSliders.length > 0 && (
            <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out">
              <Slider 
                key={`slider-${activeTab}-${currentSliders.length}-${currentSliders.map(s => s.id).join('-')}`}
                ref={sliderRef} 
                {...sliderSettings}
              >
                {currentSliders.map((slider, index) => (
                  <div key={slider.id} className="relative" style={{ height: '600px' }}>
                    <Image
                      src={slider.imageUrl}
                      alt={`Hero background ${slider.order + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      quality={90}
                      sizes="50vw"
                      unoptimized={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 from-10% dark:from-darkmode/90 to-herobg/90 to-90% dark:to-darklight/90 z-10 pointer-events-none"></div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>

        {/* Part 2 - Left Side */}
        <div 
          className={`relative w-1/2 h-full ${
            activePart === 2 ? 'z-10' : 'z-0'
          }`}
        >
          {activePart === 2 && currentSliders.length > 0 && (
            <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out">
              <Slider 
                key={`slider-${activeTab}-${currentSliders.length}-${currentSliders.map(s => s.id).join('-')}-part2`}
                {...sliderSettings}
              >
                {currentSliders.map((slider, index) => (
                  <div key={slider.id} className="relative" style={{ height: '600px' }}>
                    <Image
                      src={slider.imageUrl}
                      alt={`Hero background ${slider.order + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      quality={90}
                      sizes="50vw"
                      unoptimized={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 from-10% dark:from-darkmode/90 to-herobg/90 to-90% dark:to-darklight/90 z-10 pointer-events-none"></div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
      
      {/* Fallback gradient background if no sliders */}
      {currentSliders.length === 0 && (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/80 from-10% dark:from-darkmode/80 to-herobg/80 to-90% dark:to-darklight/80"></div>
      )}

      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md relative z-20">
        <div className="grid lg:grid-cols-12 grid-cols-1">
          <div
            className="flex flex-col col-span-6 justify-center items-start"
            data-aos="fade-right"
          >
            <div className="mb-8">
              <h1 className="md:text-[50px] leading-[1.2] text-4xl  ml-4 text-midnight_text dark:text-white font-bold">
                Find Your Best Real Estate
              </h1>
            </div>
            <div className="max-w-xl ml-4 sm:w-full">
              <div className="flex gap-1 bg-trasperent">
                <button
                  className={`px-9 py-3 text-xl rounded-t-md focus:outline-none ${activeTab === "sell"
                    ? "bg-white dark:bg-darkmode text-midnight_text dark:text-white border-b border-primary"
                    : "text-midnight_text bg-white bg-opacity-50 dark:text-white dark:bg-darkmode dark:bg-opacity-50"
                    }`}
                  onClick={() => handleTabChange("sell")}
                >
                  Sell
                </button>
                <button
                  className={`px-9 py-3 text-xl rounded-t-md focus:outline-none ${activeTab === "buy"
                    ? "bg-white dark:bg-darkmode dark:text-white text-midnight_text border-b border-primary"
                    : "text-midnight_text bg-white bg-opacity-50 dark:text-white dark:bg-darkmode dark:bg-opacity-50"
                    }`}
                  onClick={() => handleTabChange("buy")}
                >
                  Buy
                </button>
              </div>
              <div className="bg-white dark:bg-transparent rounded-b-lg rounded-tr-lg">
                {activeTab === "sell" && (
                  <div className="bg-white dark:bg-darkmode rounded-b-lg rounded-tr-lg shadow-lg p-8 pb-10">
                    <div className="relative rounded-lg border-0 my-2">
                      <div className="relative flex items-center">
                        <div className="absolute left-0 p-4">
                          <Image
                            src="/images/svgs/icon-location.svg"
                            alt="Icon"
                            height={24}
                            width={24}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Search Location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                          className="py-5 pr-3 pl-14 w-full rounded-lg text-black border border-border dark:text-white dark:border-dark_border focus:border-primary dark:focus:border-primary focus-visible:outline-none dark:bg-[#0c121e]"
                        />

                        {showSuggestions && (
                          <div className="absolute left-0 right-0 top-full -mt-2 bg-white dark:bg-semidark border border-border rounded-md z-10 max-h-[130px] overflow-y-auto">
                            <ul className="flex flex-col gap-2 py-4 px-8">
                              {suggestions.map((item, index) => (
                                <li
                                  key={index}
                                  onClick={() => handleSelect(item)}
                                >
                                  <p className="cursor-pointer text-midnight_text dark:text-white text-lg hover:text-primary dark:hover:text-primary">{item}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      </div>
                    </div>
                    <div className="mt-6 flex flex-col-reverse gap-4 md:justify-between">
                      <div className="flex flex-col md:flex-row md:gap-4 w-full">
                        <button onClick={handleSearchSell} className="flex-1 py-2 md:py-4 text-lg md:text-xl px-4 md:px-8 bg-primary text-white rounded-lg hover:bg-darkGreen transition duration-300 mb-2 md:mb-0 md:mr-2">
                          Search
                        </button>
                        <button onClick={handleSearchSell} className="flex-1 py-2 md:py-4 text-lg md:text-xl px-4 md:px-8 bg-primary/80 dark:bg-primary/80 dark:hover:bg-primary dark:hover:border-primary border border-transparent text-white rounded-lg hover:bg-primary transition duration-300 text-nowrap">
                          Advance Search
                        </button>
                      </div>
                      {error && (
                        <p className="text-red-600 text-sm mt-2 md:mt-0">{error}</p>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "buy" && (
                  <div className="bg-white dark:bg-darkmode rounded-b-lg rounded-tr-lg shadow-lg p-8 pb-10">
                    <div className="rounded-lg border-0 my-2">
                      <div className="relative flex items-center">
                        <div className="absolute left-0 p-4">
                          <Image
                            src="/images/svgs/icon-location.svg"
                            alt="Icon"
                            height={24}
                            width={24}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Search Location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                          className="py-5 pr-3 pl-14 w-full rounded-lg text-black border border-border dark:text-white dark:border-dark_border focus:border-primary dark:focus:border-primary focus-visible:outline-none dark:bg-[#0c121e]"
                        />
                        {showSuggestions && (
                          <div className="absolute left-0 right-0 top-full -mt-2 bg-white border border-border rounded-md z-10 max-h-[100px] overflow-y-auto">
                            <ul className="flex flex-col gap-2 py-4 px-8">
                              {suggestions.map((item, index) => (
                                <li
                                  key={index}
                                  className="cursor-pointer hover:text-primary"
                                  onClick={() => handleSelect(item)}
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col-reverse gap-4 md:justify-between">
                      <div className="flex flex-col md:flex-row md:gap-4 w-full">
                        <button onClick={handleSearchBuy} className="flex-1 py-2 md:py-4 text-lg md:text-xl px-4 md:px-8 bg-primary text-white rounded-lg hover:bg-darkGreen transition duration-300 mb-2 md:mb-0 md:mr-2">
                          Search
                        </button>
                        <button onClick={handleSearchBuy} className="flex-1 py-2 md:py-4 text-lg md:text-xl px-4 md:px-8 bg-primary/80 dark:bg-primary/80 dark:hover:bg-primary dark:hover:border-primary border border-transparent text-white rounded-lg hover:bg-primary transition duration-300 text-nowrap">
                          Advance Search
                        </button>
                      </div>
                      {error && (
                        <p className="text-red-600 text-sm mt-2 md:mt-0">{error}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-start ml-4 mt-8 mb-12 gap-3">
              <div className="flex space-x-2" data-aos="fade-left">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.763l-6 5.847L19.336 24 12 20.019 4.664 24 6 15.61 0 9.763l8.332-1.745z" />
                </svg>
                <svg
                  className="w-6 h-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.763l-6 5.847L19.336 24 12 20.019 4.664 24 6 15.61 0 9.763l8.332-1.745z" />
                </svg>
                <svg
                  className="w-6 h-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.763l-6 5.847L19.336 24 12 20.019 4.664 24 6 15.61 0 9.763l8.332-1.745z" />
                </svg>
                <svg
                  className="w-6 h-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.763l-6 5.847L19.336 24 12 20.019 4.664 24 6 15.61 0 9.763l8.332-1.745z" />
                </svg>
                <svg
                  className="w-6 h-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431L24 9.763l-6 5.847L19.336 24 12 20.019 4.664 24 6 15.61 0 9.763l8.332-1.745z" />
                </svg>
              </div>
              <div data-aos="fade-left">
                <p className="text-lg dark:text-white text-black">
                  4.9/5
                  <span className="text-gray-400"> - from 658 reviews</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
