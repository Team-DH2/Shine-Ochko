"use client";

import { CarouselMy } from "@/components/us/CarouselMy";
import { Hero } from "@/components/us/Hero";
import { WhyChooseUs } from "@/components/us/WhyChooseUs";
import { LayoutFooter } from "@/components/us/LayoutFooter";

export default function Page() {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <section className="h-screen snap-start snap-always overflow-hidden">
        <CarouselMy halls={[]} />
      </section>

      <section className="h-screen snap-start">
        <Hero />
      </section>

      <section className="h-screen snap-start">
        <WhyChooseUs />
      </section>

      <section className=" snap-start">
        <LayoutFooter />
      </section>
    </main>
  );
}
