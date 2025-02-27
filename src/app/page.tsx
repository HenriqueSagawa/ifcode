import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { Hero } from "@/components/Hero";
import { GeminiSection } from "@/components/GeminiSection";
import { Feature } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { CardFeature } from "@/components/CardFeature";

/**
 * Componente principal da página inicial (Home).
 *
 * Este componente renderiza a estrutura da página inicial, incluindo um spotlight,
 * o componente Hero, seções de features, estatísticas e informações do Gemini.
 *
 * @returns {JSX.Element} A página inicial renderizada.
 */
export default function Home() {
  return (
    <div>
      {/* Spotlight - Efeito visual de destaque */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="green"
      />

      {/* Hero - Seção principal com informações sobre o site/aplicação */}
      <Hero />

      {/* Feature -  seção com as principais funcionalidades do site */}
      <Feature/>

      {/* Stats - Exibe estatísticas relevantes */}
      <Stats />

      {/* CardFeature - Exibe um componente com cards de features*/}
      <CardFeature />

      {/* GeminiSection - Integração ou informações sobre o Gemini (IA do Google) */}
      <GeminiSection />
    </div>
  );
}
