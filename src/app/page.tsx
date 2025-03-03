'use client'

import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { Hero } from "@/components/Hero";
import { GeminiSection } from "@/components/GeminiSection";
import { Feature } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { CardFeature } from "@/components/CardFeature";
import { motion } from "motion/react";


export default function Home() {

  return (
    <div className="relative">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{
        duration: 4,
      }} className="!w-full !h-screen -top-[500px] md:-top-[1000px] !blur-[1000px] !z-0 bg-green-600 rounded-full shadow-green-400 shadow-2xl absolute" />

      <Hero />


      <Feature />

      <Stats />

      <CardFeature />

      <GeminiSection />

    </div>
  );
}
