"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';

interface PropertySection {
    id: string;
    name: string;
    description?: string;
    images: Array<{ id: string; url: string; filename: string }>;
    order: number;
}

interface TabbarProps {
    sections?: PropertySection[];
}

// Define the type for each tab's content
type TabContent = {
    title: string;
    description: string;
    features: string[];
    image: string;
};

// Define possible tab labels
type TabLabel = 'Project Complex' | 'Project Park' | 'Project Gallery' | 'Project Villa';

// Default content for when no sections are available
const defaultContent: Record<TabLabel, TabContent> = {
    'Project Complex': {
        title: 'Values of smart living in Vista Residence, NY',
        description: 'Sometimes by accident, sometimes chunks as necessary making this the first true generator on the Internet.',
        features: [
            'Wellness & Spa',
            'Fitness',
            'Conference',
            'Library',
            'Restaurant',
            'Bars'
        ],
        image: '/images/tabbar/tab-1.jpg'
    },
    'Project Park': {
        title: 'Project Park Overview',
        description: 'Sometimes by accident, sometimes chunks as necessary making this the first true generator on the Internet.',
        features: ['Gardens', 'Playgrounds', 'Walking Trails'],
        image: '/images/tabbar/tab-2.jpg'
    },
    'Project Gallery': {
        title: 'Explore the Gallery',
        description: 'Sometimes by accident, sometimes chunks as necessary making this the first true generator on the Internet.',
        features: ['Art Exhibitions', 'Cultural Events'],
        image: '/images/tabbar/tab-3.jpg'
    },
    'Project Villa': {
        title: 'Luxury Villas',
        description: 'Sometimes by accident, sometimes chunks as necessary making this the first true generator on the Internet.',
        features: ['Private Pools', 'Gourmet Kitchens', 'Spacious Living Areas'],
        image: '/images/tabbar/tab-4.jpg'
    }
};

// Default tabs
const defaultTabs: { label: TabLabel, icon: string }[] = [
    { label: 'Project Complex', icon: 'mdi:home' },
    { label: 'Project Park', icon: 'mdi:store' },
    { label: 'Project Gallery', icon: 'mdi:building' },
    { label: 'Project Villa', icon: 'mdi:warehouse' }
];

// Utility function to chunk an array into smaller arrays of a specified size
const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
};

export default function Tabbar({ sections = [] }: TabbarProps) {
    // Use sections if available, otherwise use default tabs
    const hasSections = sections && sections.length > 0;
    const tabs = hasSections 
        ? sections.map((section, index) => ({
            id: section.id,
            label: section.name as TabLabel,
            icon: 'mdi:home',
            section: section,
        }))
        : defaultTabs.map(tab => ({ ...tab, id: tab.label, section: null }));

    const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'Project Complex');

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    const getTabContent = (tab: typeof tabs[0]) => {
        if (hasSections && tab.section) {
            const section = tab.section;
            return {
                title: section.name,
                description: section.description || '',
                images: section.images || [],
            };
        } else {
            const defaultTab = defaultContent[tab.label as TabLabel];
            return {
                title: defaultTab?.title || '',
                description: defaultTab?.description || '',
                images: defaultTab?.image ? [{ url: defaultTab.image }] : [],
            };
        }
    };

    return (
        <section className='dark:bg-darkmode'>
            <div className='max-w-screen-xl mx-auto'>
                <div className="flex flex-wrap justify-center gap-1 bg-transparent" role="tablist">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`px-4 py-2 text-lg rounded-t-md focus:outline-none flex items-center justify-center
                            ${activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-gray transition duration-300 hover:text-primary'
                                }`}
                            onClick={() => handleTabChange(tab.id)}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`content-${tab.id}`}
                        >
                            <span className="hidden sm:flex">{tab.label}</span>
                            <span className="sm:hidden">
                                <Icon icon={tab.icon} />
                            </span>
                        </button>
                    ))}
                </div>

                <div className="rounded-b-lg rounded-tr-lg">
                    {tabs.map((tab) => {
                        const content = getTabContent(tab);
                        return (
                            <div
                                key={tab.id}
                                id={`content-${tab.id}`}
                                role="tabpanel"
                                className={`max-w-screen-xl mt-11 mx-auto ${activeTab === tab.id ? 'block' : 'hidden'}`}
                            >
                                <div className="max-w-6xl mx-auto" data-aos='fade-up'>
                                    <div className="flex flex-col lg:flex-row">
                                        <div className="lg:w-1/2 px-4 flex flex-col justify-center">
                                            <p className='md:text-4xl text-[28px] leading-[1.2] text-midnight_text dark:text-white font-bold'>
                                                {content.title}
                                            </p>
                                            {content.description && (
                                                <p className='my-6 text-gray text-lg'>
                                                    {content.description}
                                                </p>
                                            )}
                                            {content.images.length > 0 && (
                                                <div className="grid grid-cols-2 gap-2 mt-4">
                                                    {content.images.slice(0, 4).map((img: any, idx: number) => (
                                                        <div key={idx} className="relative h-32 rounded-lg overflow-hidden">
                                                            <Image
                                                                src={img.url}
                                                                alt={`${content.title} - Image ${idx + 1}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="lg:w-1/2 h-[450px] md:block hidden px-4">
                                            {content.images.length > 0 ? (
                                                <Image
                                                    src={content.images[0]?.url || '/images/blog/blog-1.jpg'}
                                                    alt={`Image for ${content.title}`}
                                                    width={570}
                                                    height={367}
                                                    className='rounded-lg w-full h-full object-cover'
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                    <p className="text-gray-500 dark:text-gray-400">No image available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
