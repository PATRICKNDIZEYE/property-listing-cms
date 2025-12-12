import React, { FC } from "react";
import Breadcrumb from "../../breadcrumb";
import { BreadcrumbLink } from "@/app/types/data/breadcrumb";

interface HeroSubProps {
    title: string;
    description: string;
    subDescription?: string;
    useImigongoBackground?: boolean;
    compact?: boolean;
    hideBreadcrumb?: boolean;
    breadcrumbLinks: BreadcrumbLink[];
}

const HeroSub: FC<HeroSubProps> = ({
    title,
    description,
    subDescription,
    useImigongoBackground = false,
    compact = false,
    hideBreadcrumb = false,
    breadcrumbLinks,
}) => {

    return (
        <>
            <section
                className={`text-center bg-cover relative overflow-x-hidden ${
                    useImigongoBackground
                        ? "bg-transparent"
                        : "bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight"
                }`}
            >
                <div className={`${compact ? "pt-16 pb-3" : "pt-36 pb-20"} relative`}>
                {useImigongoBackground && (
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[#F4EEDF]/80 dark:bg-darkmode/80 pointer-events-none"
                    />
                )}
                <h2 className="text-midnight_text text-[50px] leading-[1.2] relative font-bold dark:text-white capitalize z-10">{title}</h2>
                <p className={`text-lg text-gray font-normal max-w-md w-full mx-auto ${compact ? "mt-3" : "mt-7"} sm:px-0 px-4 relative z-10`}>
                    {description}
                </p>
                {subDescription && (
                    <p className={`text-lg text-gray font-normal max-w-md w-full mx-auto mt-2 ${compact ? "mb-3" : "mb-12"} sm:px-0 px-4 relative z-10`}>
                        {subDescription}
                    </p>
                )}
                {!subDescription && !hideBreadcrumb && (
                    <div className={`${compact ? "mb-6" : "mb-12"} relative z-10`}></div>
                )}
                {!hideBreadcrumb && (
                    <div className="relative z-10">
                        <Breadcrumb links={breadcrumbLinks} />
                    </div>
                )}
                </div>
            </section>
        </>
    );
};

export default HeroSub;