export interface Filters {
  /** Rent/Sale selector (normalized internally) */
  listingCategory: '' | 'rent' | 'sale';

  /** Property type (apartment/house/villa/...) */
  category: string;

  /** Location */
  location: string;

  /** Price range (applied via Apply button) */
  minPrice?: string;
  maxPrice?: string;

  /** More filters */
  rooms?: string;
  baths?: string;
  garages?: string;

  /** Amenities (derived from property sections names if available) */
  hasSwimmingPool?: boolean;
  hasLivingRoom?: boolean;

  /** Availability flags */
  hasParking?: boolean;
  hasGarage?: boolean;
}
  