import Image from "next/image";
import React from "react";
import Link from "next/link";
import "../../../../style/index.css";
import { propertyData } from "@/app/types/property/propertyData";
import { formatPriceRwf, normalizeListingLabel } from "@/utils/currency";

interface PropertyCardProps {
  property: propertyData;
  viewMode?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode }) => {  
  const listingLabel = normalizeListingLabel(property.status) || normalizeListingLabel(property.tag) || '';
  const badgeFill = listingLabel === 'Rent' ? '#2563EB' : '#DC2626'; // rent=blue, sale=red
  const badgeStroke = 'rgba(255,255,255,0.35)';
  
  return (
    <div
      className={`bg-white shadow-property dark:bg-darklight rounded-lg overflow-hidden transition-opacity duration-300`}
      style={{ minHeight: '400px', willChange: 'auto' }}
    >
      <Link href={`/properties/properties-list/${property.slug}`} className={`group ${viewMode=="list" && 'flex' }`}>
        <div className={`relative ${viewMode=="list" && 'w-[30%]'}`}>
          <div className={`imageContainer h-[250px] w-full ${viewMode =="list" && 'h-full md:h-52'}`}>
            <Image
              src={property?.property_img}
              alt={`Property in ${property.location}`}
              width={400}
              height={250}
              className="w-full h-full object-cover group-hover:scale-125 duration-500"
            />
          </div>
          {listingLabel && (
            <span
              aria-label={listingLabel}
              className="absolute top-[10px] left-[10px] z-10 tag-badge-wiggle drop-shadow-md"
            >
              <span className="relative inline-block">
                <svg
                  width="86"
                  height="38"
                  viewBox="0 0 86 38"
                  xmlns="http://www.w3.org/2000/svg"
                  className="block"
                >
                  <path
                    d="M10 19 L24 5 H84 L70 19 L84 33 H24 Z"
                    fill={badgeFill}
                    stroke={badgeStroke}
                    strokeWidth="1.5"
                  />
                  <circle cx="24" cy="19" r="4.2" fill="rgba(255,255,255,0.85)" />
                  <circle cx="24" cy="19" r="2.1" fill={badgeFill} opacity="0.35" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center pl-5 pr-2">
                  <span className="text-[11px] font-extrabold tracking-widest text-white uppercase">
                    {listingLabel}
                  </span>
                </span>
              </span>
            </span>
          )}
        </div>
        <div className={`p-5 sm:p-8 dark:text-white text-opacity-50 ${viewMode=="list" && 'w-[70%] flex flex-col justify-center'}`}>

          <div className="flex flex-col gap-1 border-b border-border dark:border-dark_border mb-6">
            
            <div>
              <div className="flex items-center gap-2 text-base text-gray">
                <Image
                  src="/images/svgs/icon-location.svg"
                  alt="Location"
                  width={16}
                  height={16}
                  className="opacity-70"
                />
                <p className="text-base text-gray">{property.location}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pb-4">
              <div className="font-bold text-2xl text-[#22C55E] dark:text-[#22C55E] whitespace-nowrap tabular-nums leading-none">
                {formatPriceRwf(property.property_price)}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-between">
            <div className="flex flex-col">
              <p className="md:text-xl text-lg font-bold flex gap-2">
                <Image
                  src="/images/svgs/icon-bed.svg"
                  alt="Bedrooms Icon"
                  height={18}
                  width={18}
                  style={{ width: "auto", height: "auto" }}
                />
                {property.beds}
              </p>
              <p className="text-sm text-gray">
                Bedrooms
              </p>
            </div>
            <div className="flex flex-col">
              <p className="md:text-xl text-lg font-bold flex gap-2">
                <Image
                  src="/images/svgs/icon-tub.svg"
                  alt="Bathrooms Icon"
                  height={18}
                  width={18}
                  style={{ width: "auto", height: "auto" }}
                />
                {property.bathrooms}
              </p>
              <p className="text-sm text-gray">
                Bathroom
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
