'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Image from 'next/image';

interface Property {
  id: string;
  propertyTitle: string;
  propertyPrice: string;
  category: string;
  location: string;
  propertyImg: string;
  status: string;
  featured: boolean;
  views: number;
  createdAt: string;
}

interface PropertyListProps {
  properties: Property[];
}

export default function EnhancedPropertyList({ properties }: PropertyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Extract unique locations from properties
  const uniqueLocations = [...new Set(properties.map(p => p.location))].sort();

  // Filter and sort properties
  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = property.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || property.category === filterCategory;
      const matchesStatus = !filterStatus || property.status === filterStatus;
      const matchesLocation = !filterLocation || property.location === filterLocation;
      
      // Price range filter
      let matchesPrice = true;
      if (filterPriceMin || filterPriceMax) {
        const price = parseInt(property.propertyPrice.replace(/[^0-9]/g, ''), 10) || 0;
        if (filterPriceMin && price < parseInt(filterPriceMin)) matchesPrice = false;
        if (filterPriceMax && price > parseInt(filterPriceMax)) matchesPrice = false;
      }
      
      return matchesSearch && matchesCategory && matchesStatus && matchesLocation && matchesPrice;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Property];
      const bValue = b[sortBy as keyof Property];
      const order = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * order;
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * order;
      }
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Buy': { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400' },
      'Rent': { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400' },
      'Sell': { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-800 dark:text-purple-400' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Buy;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-semidark rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border dark:border-dark_border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-midnight_text dark:text-white mb-1">
              Hillside Prime Management
            </h2>
            <p className="text-sm text-gray dark:text-gray">
              Manage all Hillside Prime, listings, and Hillside Prime details
            </p>
          </div>
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon icon="ion:add-outline" className="w-5 h-5" />
            Add New Property
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-border dark:border-dark_border bg-light dark:bg-darklight/50">
        <div className="space-y-4">
          {/* Row 1: Search and Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Search
              </label>
              <div className="relative">
                <Icon icon="ion:search-outline" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray" />
                <input
                  type="text"
                  placeholder="Search by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                title="Filter property category"
              >
                <option value="">All Categories</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                title="Filter property status"
              >
                <option value="">All Status</option>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
                <option value="Sell">Sell</option>
              </select>
            </div>
          </div>

          {/* Row 2: Location and Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Location
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                title="Filter by location"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Min Price
              </label>
              <input
                type="number"
                placeholder="Min price"
                value={filterPriceMin}
                onChange={(e) => setFilterPriceMin(e.target.value)}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Max Price
              </label>
              <input
                type="number"
                placeholder="Max price"
                value={filterPriceMax}
                onChange={(e) => setFilterPriceMax(e.target.value)}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight_text dark:text-white mb-2">
                Sort By
              </label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="w-full px-4 py-2 border border-border dark:border-dark_border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkmode dark:text-white"
                title="Sort properties"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="propertyTitle-asc">Title A-Z</option>
                <option value="propertyTitle-desc">Title Z-A</option>
                <option value="views-desc">Most Viewed</option>
                <option value="views-asc">Least Viewed</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || filterCategory || filterStatus || filterLocation || filterPriceMin || filterPriceMax) && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    Search: {searchTerm}
                  </span>
                )}
                {filterCategory && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    Category: {filterCategory}
                  </span>
                )}
                {filterStatus && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    Status: {filterStatus}
                  </span>
                )}
                {filterLocation && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    Location: {filterLocation}
                  </span>
                )}
                {(filterPriceMin || filterPriceMax) && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    Price: ${filterPriceMin || '0'} - ${filterPriceMax || '∞'}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('');
                    setFilterStatus('');
                    setFilterLocation('');
                    setFilterPriceMin('');
                    setFilterPriceMax('');
                  }}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="p-6">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="ion:home-outline" className="w-16 h-16 text-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-midnight_text dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-gray dark:text-gray mb-4">
              {searchTerm || filterCategory || filterStatus || filterLocation || filterPriceMin || filterPriceMax
                ? 'Try adjusting your filters' 
                : 'Get started by adding your first property'
              }
            </p>
            {!searchTerm && !filterCategory && !filterStatus && (
              <Link
                href="/admin/properties/new"
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Icon icon="ion:add-outline" className="w-5 h-5" />
                Add New Property
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white dark:bg-darkmode border border-border dark:border-dark_border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Property Image */}
                <div className="relative h-48">
                  <Image
                    src={property.propertyImg || '/images/properties/prop-1.jpg'}
                    alt={property.propertyTitle}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(property.status)}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    {property.featured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded-full">
                        <Icon icon="ion:star" className="w-3 h-3 inline mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Hillside Prime Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-midnight_text dark:text-white text-lg line-clamp-2">
                      {property.propertyTitle}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-gray dark:text-gray mb-2">
                    <Icon icon="ion:location-outline" className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">
                      {property.propertyPrice}
                    </div>
                    <div className="flex items-center text-gray dark:text-gray text-sm">
                      <Icon icon="ion:eye-outline" className="w-4 h-4 mr-1" />
                      {property.views} views
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Icon icon="ion:create-outline" className="w-4 h-4" />
                      Edit
                    </Link>
                    <button className="px-3 py-2 border border-border dark:border-dark_border text-midnight_text dark:text-white rounded-lg hover:bg-light dark:hover:bg-darklight transition-colors" title="Delete property" aria-label="Delete property">
                      <Icon icon="ion:trash-outline" className="w-4 h-4" />
                      <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}