import React from "react";
import { Metadata } from "next";
import Hero from "../../app/components/home/hero";
import Calculator from "../../app/components/home/calculator";
import History from "../../app/components/home/history";
import Features from "../../app/components/shared/features";
import CompanyInfo from "../../app/components/home/info";
import BlogSmall from "../../app/components/shared/blog";
import DiscoverProperties from "../../app/components/home/property-option";
import Listing from "../../app/components/home/property-list";
import Testimonials from "../../app/components/home/testimonial";
export const metadata: Metadata = {
  title: "Hillside Prime",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <DiscoverProperties />
      <Listing />
      <Calculator />
      <Features />
      <History />
      <Testimonials />
      <CompanyInfo />
      <BlogSmall />
    </main>
  );
}
