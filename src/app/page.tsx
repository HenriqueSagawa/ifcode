import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { Hero } from "@/components/Hero/Index";


export default function Home() {
  return (
    <div>
      
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="green"
      />

      <Hero />



    </div>
  );
}
