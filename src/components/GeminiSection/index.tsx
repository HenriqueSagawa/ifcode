// Diretiva do Next.js para Client Component, essencial pois utiliza hooks
// que interagem com o navegador (useScroll, useTransform, useRef).
"use client";

// Importações de hooks do Framer Motion para animações baseadas em scroll.
import { useScroll, useTransform } from "framer-motion";
// Importa React e o hook useRef para referenciar elementos DOM.
import React from "react";
// Importa o componente visual customizado que exibe o efeito Gemini.
import { GoogleGeminiEffect } from "../ui/google-gemini-effect"; // Ajuste o caminho se necessário

/**
 * Componente que atua como container e controlador para a animação
 * `GoogleGeminiEffect`, disparada pela rolagem (scroll) da página.
 *
 * Ele define uma seção alta na página e usa os hooks `useScroll` e `useTransform`
 * do Framer Motion para mapear o progresso da rolagem dentro dessa seção
 * para os comprimentos de múltiplos caminhos de animação, que são então
 * passados para o componente `GoogleGeminiEffect`.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX que contém a animação Gemini controlada por scroll.
 */
export function GeminiSection() {
  // Cria uma referência (ref) para o elemento div principal do container.
  // Esta ref será usada como o alvo ('target') para o hook `useScroll`.
  const ref = React.useRef(null);

  // Hook `useScroll` do Framer Motion:
  // - target: Monitora a rolagem relativa ao elemento referenciado por `ref`.
  // - offset: Define quando a animação começa e termina em relação à viewport.
  //   - "start start": A animação começa (progresso 0) quando o topo do `ref` atinge o topo da viewport.
  //   - "end start": A animação termina (progresso 1) quando o fundo do `ref` atinge o topo da viewport.
  //   Isto significa que a animação ocorre enquanto o elemento `ref` está rolando pela viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Hooks `useTransform` do Framer Motion:
  // Mapeiam o `scrollYProgress` (um valor MotionValue entre 0 e 1) para diferentes
  // comprimentos de caminho para a animação `GoogleGeminiEffect`.
  // - O mapeamento ocorre enquanto `scrollYProgress` vai de 0 a 0.8 (a animação acontece
  //   principalmente nos primeiros 80% da rolagem do elemento).
  // - Os diferentes valores iniciais (0.2, 0.15, ..., 0) provavelmente criam um efeito
  //   escalonado ou de paralaxe entre os diferentes "raios" da animação Gemini.
  // - O valor final de 1.2 pode ser para garantir que a animação complete visualmente.
  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  // Renderização do JSX
  return (
    // Container principal da seção.
    // - h-[400vh]: Altura muito grande (400% da altura da viewport) para fornecer
    //   espaço suficiente para a animação baseada em scroll acontecer completamente,
    //   considerando o `offset` definido em `useScroll`.
    // - ref={ref}: Associa a referência ao elemento para que `useScroll` possa monitorá-lo.
    // - relative, pt-28, overflow-clip: Estilos adicionais de layout e contenção.
    <div
      className="h-[400vh] w-full rounded-md relative pt-28 overflow-clip bg-black" // Adicionado bg-black para contexto visual
      ref={ref}
    >
      {/* Renderiza o componente visual do efeito Gemini. */}
      {/* Passa os MotionValues transformados como um array para a prop `pathLengths`.
          O componente `GoogleGeminiEffect` internamente usará esses valores
          para controlar a animação de seus caminhos/raios. */}
      <GoogleGeminiEffect
        title="O Futuro da IA" // Exemplo de Título
        description="Explore como a IA está moldando nosso mundo, impulsionada por modelos avançados como o Gemini." // Exemplo de Descrição
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