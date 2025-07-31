'use client'

import CTA from "@/components/Cta";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import PopularQuestions from "@/components/PopularQuestions";
import Stats from "@/components/Stats";
import SupportedLanguages from "@/components/SupportedLenguages";

export default function Home() {

  return (
    <div className="relative">
      <main>
        <Hero />
        <HowItWorks />
        <Stats />
        <SupportedLanguages />
        <PopularQuestions />
        <CTA />
      </main>

    </div>
  );
}
