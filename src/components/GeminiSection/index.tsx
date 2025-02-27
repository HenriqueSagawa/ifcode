"use client";
import { useScroll, useTransform } from "framer-motion";
import React from "react";
import { GoogleGeminiEffect } from "../ui/google-gemini-effect";

/**
 * Componente que cria uma seção com um efeito visual inspirado no Google Gemini.
 *
 * Este componente utiliza a biblioteca `framer-motion` para animar um efeito visual
 * baseado no progresso do scroll da página.
 *
 * @returns {JSX.Element} A seção Gemini renderizada.
 */
export function GeminiSection() {
  const ref = React.useRef(null); // Referência para o elemento HTML da seção.
  const { scrollYProgress } = useScroll({
    target: ref, // Define o elemento alvo para rastrear o scroll.
    offset: ["start start", "end start"], // Define os offsets para o início e o fim do scroll.
  });

  // Define as animações para o comprimento do caminho de cada linha no efeito Gemini.
  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div
      className="h-[400vh] w-full rounded-md relative pt-28 overflow-clip"
      ref={ref} // Atribui a referência ao elemento HTML.
    >
      {/* Renderiza o componente GoogleGeminiEffect e passa os comprimentos dos caminhos como propriedades. */}
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />
    </div>
  );
}
