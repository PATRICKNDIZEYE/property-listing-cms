import React from 'react';

interface TextSectionProps {
    description?: string;
}

export default function TextSection({ description }: TextSectionProps) {
    const displayText = description || 'Aenean facilisis, neque id sagittis volutpat, sapien nibh porttitor neque, et ullamcorper justo lectus tempus neque. Donec maximus dolor mauris, ut lacinia sem blandit eu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.';

    return (
        <section className='py-0 dark:bg-darkmode'>
            <div className='max-w-4xl mx-auto text-center text-gray' data-aos='fade-up'>
                <p className='text-base sm:text-lg md:text-xl lg:text-2xl px-4 sm:px-6 md:px-8'>
                    {displayText}
                </p>
            </div>
        </section>
    );
}
