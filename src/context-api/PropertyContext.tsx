'use client';

import { Filters } from '@/app/types/property/filtertypes';
import { propertyData } from '@/app/types/property/propertyData';
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react';

interface PropertyContextType {
  properties: propertyData[];
  setProperties: Dispatch<SetStateAction<propertyData[]>>;
  filters: Filters;
  setFilters: any;
  updateFilter: (key: keyof Filters, value: string | boolean) => void;
}

export const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allProperties, setAllProperties] = useState<propertyData[]>([]);
  const [properties, setProperties] = useState<propertyData[]>([]);
  const [filters, setFilters] = useState<Filters>({
    location: '',
    category: '',
    listingCategory: '',
    minPrice: '',
    maxPrice: '',
    rooms: '',
    baths: '',
    garages: '',
    hasSwimmingPool: false,
    hasLivingRoom: false,
    hasParking: false,
    hasGarage: false,
  });

  // Fetch properties from the API route
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/propertydata');
        const data: propertyData[] = await res.json();
        setAllProperties(data);
        setProperties(data); // set initially unfiltered list
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };

    fetchProperties();
  }, []);

  // Apply filters whenever `filters` or `allProperties` change
  useEffect(() => {
    const filteredProperties = allProperties.filter((property) => {
      // Parse property price (remove currency symbols and commas)
      const propertyPrice = parseInt(property.property_price.replace(/[^0-9]/g, ''), 10) || 0;
      const minPrice = filters.minPrice ? parseInt(filters.minPrice.toString().replace(/[^0-9]/g, ''), 10) : 0;
      const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice.toString().replace(/[^0-9]/g, ''), 10) : Number.POSITIVE_INFINITY;

      const statusNormalized = (property.status || '').toLowerCase();
      const tagNormalized = (property.tag || '').toLowerCase();
      const listingCategory = filters.listingCategory;

      const matchesListingCategory =
        !listingCategory ||
        (listingCategory === 'rent' && (statusNormalized === 'rent' || tagNormalized === 'rent')) ||
        (listingCategory === 'sale' &&
          (statusNormalized === 'buy' ||
            statusNormalized === 'sale' ||
            tagNormalized === 'buy' ||
            tagNormalized === 'sell' ||
            tagNormalized === 'sale'));

      const roomsOk = !filters.rooms || property.rooms === Number(filters.rooms);
      const bathsOk = !filters.baths || property.bathrooms === Number(filters.baths);
      const garagesOk = !filters.garages || property.garages === Number(filters.garages);
      const hasParkingOk = !filters.hasParking || property.garages > 0;
      const hasGarageOk = !filters.hasGarage || property.garages > 0;

      const sectionNames = (property.sections || []).map((s) => (s?.name || '').toLowerCase());
      const poolOk = !filters.hasSwimmingPool || sectionNames.some((n) => n.includes('pool'));
      const livingRoomOk = !filters.hasLivingRoom || sectionNames.some((n) => n.includes('living'));
      
      return (
        (!filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.category || property.category.toLowerCase() === filters.category.toLowerCase()) &&
        matchesListingCategory &&
        roomsOk &&
        bathsOk &&
        garagesOk &&
        hasParkingOk &&
        hasGarageOk &&
        (!filters.minPrice || propertyPrice >= minPrice) &&
        (!filters.maxPrice || propertyPrice <= maxPrice) &&
        poolOk &&
        livingRoomOk
      );
    });

    setProperties(filteredProperties);
  }, [filters, allProperties]);

  const updateFilter = (key: keyof Filters, value: string | boolean) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        setProperties,
        filters,
        setFilters,
        updateFilter
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
