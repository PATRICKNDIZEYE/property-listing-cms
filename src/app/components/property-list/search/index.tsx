'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Icon } from "@iconify/react";
import Image from 'next/image';
import { PropertyContext } from '@/context-api/PropertyContext';
import PropertyCard from '../../home/property-list/property-card';

export default function AdvanceSearch({ category }: { category?: string }) {
    const { properties, updateFilter, filters } = useContext(PropertyContext)!;
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
    const [searchData, setSearchData] = useState<any>([]);
    const [moreOpen, setMoreOpen] = useState(false);

    // Price range dropdown (opens min/max fields inside)
    const [priceOpen, setPriceOpen] = useState(false);
    const [minPriceInput, setMinPriceInput] = useState<string>('');
    const [maxPriceInput, setMaxPriceInput] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/pagedata')
                if (!res.ok) throw new Error('Failed to fetch')

                const data = await res.json()
                setSearchData(data?.searchOptions || [])
            } catch (error) {
                console.error('Error fetching services:', error)
            }
        }

        fetchData()
    }, [])

    const breadcrumbLinks = [
        { href: "/", text: "Home" },
        { href: "/properties/properties-list", text: "Hillside Prime List" },
    ];


    const applyPrice = () => {
        updateFilter('minPrice', minPriceInput);
        updateFilter('maxPrice', maxPriceInput);
    };

    const toggleOffCanvas = () => {
        setIsOffCanvasOpen(!isOffCanvasOpen);
    };

    const normalize = (str: string) =>
        str.toLowerCase().replace(/s$/, '');

    const filteredProperties = useMemo(() => {
        if (!category) return properties;
        return properties.filter((data: any) =>
            normalize(data.category) === normalize(category)
        );
    }, [category, properties]);

    const propertyTypes = [
        { value: '', label: 'Select category' },
        ...(searchData?.category || []),
    ];
    const locations = searchData?.locations || [];

    const listingCategories = [
        { value: '', label: 'Select category' },
        { value: 'rent', label: 'Rent' },
        { value: 'sale', label: 'Sale' },
    ];

    const filteredCount = filteredProperties.length;

    return (
        <>
            <section className='dark:bg-darkmode px-4 pt-24 pb-8 lg:pt-24 lg:pb-10'>
                <div className='lg:max-w-screen-xl max-w-screen-md mx-auto'>
                    {/* Minimal page title (no large hero / breadcrumb) */}
                    <div className="text-center pb-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-midnight_text dark:text-white">
                            Hillside Prime Listings
                        </h1>
                    </div>

                    <div className='flex lg:hidden justify-between items-center mb-4'>
                        <span className='text-2xl ml-4 '>Filters</span>
                        <button onClick={toggleOffCanvas} className='bg-primary mr-4 text-white py-3 px-6 text-base rounded-lg hover:bg-darkGreen'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6' viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z" />
                            </svg>
                        </button>
                    </div>

                    {isOffCanvasOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50" />
                    )}

                    <div onClick={toggleOffCanvas} className={`fixed inset-0 top-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 transition-transform transform ${isOffCanvasOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
                        <div className='absolute top-0 right-0 w-3/4 max-w-xs bg-white dark:bg-semidark shadow-lg h-full'>
                            <div className='py-14 px-8'>
                                <button onClick={toggleOffCanvas} className='absolute top-4 right-4 text-gray dark:text-gray-500'>
                                    ✕
                                </button>
                                <p className='mb-6 text-2xl font-semibold'>Filters</p>
                                <div className='flex flex-col gap-6'>
                                    {/* Property Type */}
                                    <div className="relative inline-block">
                                        <select
                                            value={filters.category || ''}
                                            className='custom-select py-3 text-midnight_text dark:text-gray w-full pl-3 pr-9 border border-border dark:border-dark_border dark:focus:border-primary dark:bg-semidark rounded-lg focus:border-primary'
                                            onChange={(e) => updateFilter('category', e.target.value)}
                                        >
                                            {(propertyTypes as any[])?.map((option: any, index: any) => (
                                                <option key={`type-${index}`} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Category: Rent / Sale */}
                                    <div className="relative inline-block">
                                        <select
                                            value={filters.listingCategory || ''}
                                            className='custom-select py-3 text-midnight_text dark:text-gray w-full pl-3 pr-9 border border-border dark:border-dark_border dark:focus:border-primary dark:bg-semidark rounded-lg focus:border-primary'
                                            onChange={(e) => updateFilter('listingCategory', e.target.value)}
                                        >
                                            {listingCategories.map((option, index) => (
                                                <option key={`listing-${index}`} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Render Location dropdown */}
                                    <div className="relative inline-block">
                                        <select
                                            value={filters.location || ''}
                                            className='custom-select py-3 text-midnight_text dark:text-gray w-full pl-3 pr-9 border border-border dark:border-dark_border dark:focus:border-primary dark:bg-semidark rounded-lg focus:border-primary'
                                            onChange={(e) => updateFilter('location', e.target.value)}
                                        >
                                            {(locations as any[])?.map((option: any, index: any) => (
                                                <option key={`location-${index}`} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price range */}
                                    <div>
                                        <p className="text-sm font-semibold text-midnight_text dark:text-white mb-2">
                                            Price range
                                        </p>
                                        <details className="group rounded-lg border border-border dark:border-dark_border bg-white/70 dark:bg-semidark/70">
                                            <summary className="list-none cursor-pointer py-3 px-3 flex items-center justify-between text-midnight_text dark:text-white">
                                                <span className="text-sm text-gray dark:text-gray">
                                                    {filters.minPrice || filters.maxPrice
                                                        ? `${filters.minPrice || '0'} - ${filters.maxPrice || 'Any'}`
                                                        : 'Any'}
                                                </span>
                                                <span className="text-gray dark:text-gray group-open:rotate-180 transition-transform">
                                                    <Icon icon="ion:chevron-down" width="18" height="18" />
                                                </span>
                                            </summary>
                                            <div className="p-3 border-t border-border/60 dark:border-dark_border/60">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        placeholder="Min"
                                                        value={minPriceInput}
                                                        onChange={(e) => setMinPriceInput(e.target.value)}
                                                        className="py-3 w-full pl-3 pr-3 border border-border dark:bg-semidark dark:border-dark_border dark:focus:border-primary !rounded-lg focus-visible:outline-none focus:border-primary"
                                                    />
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        placeholder="Max"
                                                        value={maxPriceInput}
                                                        onChange={(e) => setMaxPriceInput(e.target.value)}
                                                        className="py-3 w-full pl-3 pr-3 border border-border dark:bg-semidark dark:border-dark_border dark:focus:border-primary !rounded-lg focus-visible:outline-none focus:border-primary"
                                                    />
                                                </div>
                                                <div className="flex gap-3 mt-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setMinPriceInput('');
                                                            setMaxPriceInput('');
                                                            updateFilter('minPrice', '');
                                                            updateFilter('maxPrice', '');
                                                        }}
                                                        className="w-1/2 border border-primary text-primary rounded-lg py-2.5 hover:bg-primary hover:text-white transition-colors"
                                                    >
                                                        Clear
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            applyPrice();
                                                        }}
                                                        className="w-1/2 bg-primary hover:bg-darkGreen text-white rounded-lg py-2.5"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </details>
                                    </div>

                                    {/* More filters (dropdown) */}
                                    <details className="group rounded-lg border border-border dark:border-dark_border bg-white/70 dark:bg-semidark/70">
                                        <summary className="list-none cursor-pointer py-3 px-3 flex items-center justify-between text-midnight_text dark:text-white">
                                            <span className="text-sm text-gray dark:text-gray">More filters</span>
                                            <span className="text-gray dark:text-gray group-open:rotate-180 transition-transform">
                                                <Icon icon="ion:chevron-down" width="18" height="18" />
                                            </span>
                                        </summary>
                                        <div className="p-3 border-t border-border/60 dark:border-dark_border/60">
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div>
                                                    <label className="text-xs text-gray dark:text-gray block mb-1">Rooms</label>
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={0}
                                                        placeholder="Any"
                                                        value={filters.rooms || ''}
                                                        onChange={(e) => updateFilter('rooms', e.target.value)}
                                                        className="py-3 w-full pl-3 pr-3 border border-border dark:bg-semidark dark:border-dark_border dark:focus:border-primary !rounded-lg focus-visible:outline-none focus:border-primary text-midnight_text dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray dark:text-gray block mb-1">Bathrooms</label>
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        min={0}
                                                        placeholder="Any"
                                                        value={filters.baths || ''}
                                                        onChange={(e) => updateFilter('baths', e.target.value)}
                                                        className="py-3 w-full pl-3 pr-3 border border-border dark:bg-semidark dark:border-dark_border dark:focus:border-primary !rounded-lg focus-visible:outline-none focus:border-primary text-midnight_text dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <label className="flex items-center gap-2 text-sm text-midnight_text dark:text-white">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!filters.hasGarage}
                                                        onChange={(e) => updateFilter('hasGarage', e.target.checked)}
                                                    />
                                                    Garage
                                                </label>
                                                <label className="flex items-center gap-2 text-sm text-midnight_text dark:text-white">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!filters.hasParking}
                                                        onChange={(e) => updateFilter('hasParking', e.target.checked)}
                                                    />
                                                    Parking
                                                </label>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-sm text-midnight_text dark:text-white">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!filters.hasSwimmingPool}
                                                        onChange={(e) => updateFilter('hasSwimmingPool', e.target.checked)}
                                                    />
                                                    Swimming pool
                                                </label>
                                                <label className="flex items-center gap-2 text-sm text-midnight_text dark:text-white">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!filters.hasLivingRoom}
                                                        onChange={(e) => updateFilter('hasLivingRoom', e.target.checked)}
                                                    />
                                                    Living room
                                                </label>
                                            </div>
                                        </div>
                                    </details>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateFilter('category', '');
                                                updateFilter('listingCategory', '');
                                                updateFilter('location', '');
                                                updateFilter('rooms', '');
                                                updateFilter('baths', '');
                                                updateFilter('garages', '');
                                                updateFilter('minPrice', '');
                                                updateFilter('maxPrice', '');
                                                updateFilter('hasSwimmingPool', false);
                                                updateFilter('hasLivingRoom', false);
                                                updateFilter('hasGarage', false);
                                                updateFilter('hasParking', false);
                                                setMinPriceInput('');
                                                setMaxPriceInput('');
                                            }}
                                            className="w-1/2 border border-primary text-primary rounded-lg py-3 hover:bg-primary hover:text-white transition-colors"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsOffCanvasOpen(false);
                                            }}
                                            className='w-1/2 bg-primary hover:bg-darkGreen text-white py-3 rounded-lg'
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop horizontal filters */}
                    <div className="hidden lg:block mb-8">
                        <div className="bg-white/90 dark:bg-darkmode/60 backdrop-blur-sm shadow-property rounded-xl px-6 py-5 border border-border/60 dark:border-dark_border/60">
                            <div className="flex items-center justify-between gap-6 flex-wrap">
                                <p className="text-xl font-semibold text-midnight_text dark:text-white">
                                    Filters
                                </p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setMinPriceInput('');
                                            setMaxPriceInput('');
                                            updateFilter('listingCategory', '');
                                            updateFilter('category', '');
                                            updateFilter('location', '');
                                            updateFilter('rooms', '');
                                            updateFilter('baths', '');
                                            updateFilter('garages', '');
                                            updateFilter('minPrice', '');
                                            updateFilter('maxPrice', '');
                                            updateFilter('hasSwimmingPool', false);
                                            updateFilter('hasLivingRoom', false);
                                            updateFilter('hasGarage', false);
                                            updateFilter('hasParking', false);
                                        }}
                                        className="border border-primary text-primary hover:bg-primary hover:text-white rounded-lg px-4 py-2 text-sm transition-colors"
                                        type="button"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4 items-end">
                                {/* Property Type */}
                                <div className="min-w-[220px]">
                                    <label className="text-xs text-gray dark:text-gray block mb-1">Property Type</label>
                                    <select
                                        value={filters.category || ''}
                                        className="custom-select py-3 text-midnight_text dark:text-gray w-full pl-3 pr-9 border border-border dark:border-dark_border dark:focus:border-primary dark:bg-semidark rounded-lg focus:border-primary"
                                        onChange={(e) => updateFilter('category', e.target.value)}
                                    >
                                        {(propertyTypes as any[])?.map((option: any, index: any) => (
                                            <option key={`type-top-${index}`} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                    {/* Category: Rent / Sale */}
                                <div className="min-w-[200px]">
                                    <label className="text-xs text-gray dark:text-gray block mb-1">Category</label>
                                    <select
                                        value={filters.listingCategory || ''}
                                        className="custom-select py-3 text-midnight_text dark:text-gray w-full pl-3 pr-9 border border-border dark:border-dark_border dark:focus:border-primary dark:bg-semidark rounded-lg focus:border-primary"
                                        onChange={(e) => updateFilter('listingCategory', e.target.value)}
                                    >
                                        {listingCategories.map((option, index) => (
                                            <option key={`listing-top-${index}`} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location */}
                                <div className="min-w-[220px]">
                                    <label className="text-xs text-gray dark:text-gray block mb-1">Location</label>
                                    <select
                                        value={filters.location || ''}
                                        className="custom-select py-3 text-midnight_text dark:text-gray w-full pl-3 pr-9 border border-border dark:border-dark_border dark:focus:border-primary dark:bg-semidark rounded-lg focus:border-primary"
                                        onChange={(e) => updateFilter('location', e.target.value)}
                                    >
                                        {(locations as any[])?.map((option: any, index: any) => (
                                            <option key={`location-top-${index}`} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price range */}
                                <div className="min-w-[260px] relative">
                                    <label className="text-xs text-gray dark:text-gray block mb-1">Price range</label>
                                    <button
                                        type="button"
                                        onClick={() => setPriceOpen((v) => !v)}
                                        className="w-full flex items-center justify-between py-3 px-3 rounded-lg border border-border dark:border-dark_border bg-white/70 dark:bg-semidark/70 text-midnight_text dark:text-white"
                                    >
                                        <span className="text-sm text-gray dark:text-gray">
                                            {filters.minPrice || filters.maxPrice
                                                ? `${filters.minPrice || '0'} - ${filters.maxPrice || 'Any'}`
                                                : 'Any'}
                                        </span>
                                        <span className={`${priceOpen ? 'rotate-180' : ''} transition-transform text-gray dark:text-gray`}>
                                            <Icon icon="ion:chevron-down" width="18" height="18" />
                                        </span>
                                    </button>

                                    {priceOpen && (
                                        <div className="absolute left-0 top-[66px] w-full bg-white/95 dark:bg-semidark/95 backdrop-blur-sm border border-border/60 dark:border-dark_border/60 rounded-xl shadow-property p-3 z-20">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="number"
                                                    inputMode="numeric"
                                                    placeholder="Min"
                                                    value={minPriceInput}
                                                    onChange={(e) => setMinPriceInput(e.target.value)}
                                                    className="py-3 w-full pl-3 pr-3 border border-border dark:bg-semidark dark:border-dark_border dark:focus:border-primary !rounded-lg focus-visible:outline-none focus:border-primary"
                                                />
                                                <input
                                                    type="number"
                                                    inputMode="numeric"
                                                    placeholder="Max"
                                                    value={maxPriceInput}
                                                    onChange={(e) => setMaxPriceInput(e.target.value)}
                                                    className="py-3 w-full pl-3 pr-3 border border-border dark:bg-semidark dark:border-dark_border dark:focus:border-primary !rounded-lg focus-visible:outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div className="flex gap-3 mt-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMinPriceInput('');
                                                        setMaxPriceInput('');
                                                        updateFilter('minPrice', '');
                                                        updateFilter('maxPrice', '');
                                                        setPriceOpen(false);
                                                    }}
                                                    className="w-1/2 border border-primary text-primary rounded-lg py-2.5 hover:bg-primary hover:text-white transition-colors"
                                                >
                                                    Clear
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        applyPrice();
                                                        setPriceOpen(false);
                                                    }}
                                                    className="w-1/2 bg-primary hover:bg-darkGreen text-white rounded-lg py-2.5"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* More filters (same row as Price range) */}
                                <div className="min-w-[160px]">
                                    <label className="text-xs text-gray dark:text-gray block mb-1">&nbsp;</label>
                                    <button
                                        type="button"
                                        onClick={() => setMoreOpen((v) => !v)}
                                        className="w-full border border-border dark:border-dark_border text-midnight_text dark:text-white rounded-lg px-4 py-3 text-sm hover:border-primary transition-colors bg-white/70 dark:bg-semidark/70"
                                    >
                                        More filters
                                    </button>
                                </div>
                            </div>

                            {/* More filters dropdown */}
                            {moreOpen && (
                                <div className="relative mt-4">
                                    <div className="absolute right-0 top-0 w-full lg:w-[620px] bg-white/95 dark:bg-semidark/95 backdrop-blur-sm border border-border/60 dark:border-dark_border/60 rounded-xl shadow-property p-4 z-20">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                                            <div>
                                                <label className="text-xs text-gray dark:text-gray block mb-1">Rooms</label>
                                                <input
                                                    type="number"
                                                    inputMode="numeric"
                                                    min={0}
                                                    placeholder="Any"
                                                    value={filters.rooms || ''}
                                                    onChange={(e) => updateFilter('rooms', e.target.value)}
                                                    className="py-3 w-full pl-3 pr-3 border border-border dark:bg-semidark dark:border-dark_border dark:focus:border-primary !rounded-lg focus-visible:outline-none focus:border-primary text-midnight_text dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray dark:text-gray block mb-1">Bathrooms</label>
                                                <input
                                                    type="number"
                                                    inputMode="numeric"
                                                    min={0}
                                                    placeholder="Any"
                                                    value={filters.baths || ''}
                                                    onChange={(e) => updateFilter('baths', e.target.value)}
                                                    className="py-3 w-full pl-3 pr-3 border border-border dark:bg-semidark dark:border-dark_border dark:focus:border-primary !rounded-lg focus-visible:outline-none focus:border-primary text-midnight_text dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray dark:text-gray block mb-1">Parking / Garage</label>
                                                <div className="flex flex-col gap-2 mt-1">
                                                    <label className="flex items-center gap-2 text-sm text-midnight_text dark:text-white">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!filters.hasGarage}
                                                            onChange={(e) => updateFilter('hasGarage', e.target.checked)}
                                                        />
                                                        Garage
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm text-midnight_text dark:text-white">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!filters.hasParking}
                                                            onChange={(e) => updateFilter('hasParking', e.target.checked)}
                                                        />
                                                        Parking
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
                                            <label className="flex items-center gap-2 text-sm text-midnight_text dark:text-white">
                                                <input
                                                    type="checkbox"
                                                    checked={!!filters.hasSwimmingPool}
                                                    onChange={(e) => updateFilter('hasSwimmingPool', e.target.checked)}
                                                />
                                                Swimming pool
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-midnight_text dark:text-white">
                                                <input
                                                    type="checkbox"
                                                    checked={!!filters.hasLivingRoom}
                                                    onChange={(e) => updateFilter('hasLivingRoom', e.target.checked)}
                                                />
                                                Living room
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Listings */}
                    <div>
                        <div className="flex w-full justify-between px-4 pb-6">
                            <h5 className='text-xl text-midnight_text dark:text-white'>{filteredCount} Properties Found</h5>
                        </div>
                        {filteredProperties.length > 0 ?
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4" style={{ minHeight: '500px' }}>
                                {filteredProperties.map((data: any, index: any) => (
                                    <div 
                                        key={data.id || `property-${index}`} 
                                        className="opacity-100 transition-opacity duration-300 ease-in-out"
                                        style={{ minHeight: '400px' }}
                                    >
                                        <PropertyCard property={data} viewMode={'grid'} />
                                    </div>
                                ))}
                            </div>
                            :
                            <div className='flex flex-col gap-5 items-center justify-center pt-20'>
                                <Image src={"/images/not-found/no-results.png"} alt='no-result' width={100} height={100} />
                                <p className='text-gray'>No result found</p>
                            </div>
                        }
                    </div>
                </div>
            </section>
        </>
    );
}