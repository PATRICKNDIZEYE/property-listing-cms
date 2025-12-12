import React from "react";
import { Metadata } from "next";
import Hero from "../../app/components/home/hero";
import Listing from "../../app/components/home/property-list";
export const metadata: Metadata = {
  title: "Hillside Prime",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Listing />
    </main>
  );
}
