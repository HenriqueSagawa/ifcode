// Indica que este é um Client Component no Next.js App Router.
// Necessário para o hook `useTheme` e para o componente `SparklesCore`
// que provavelmente lida com animações e interações do lado do cliente.
"use client";

import React from "react";
// Importa o componente que gera o efeito de partículas animadas.
import { SparklesCore } from "../ui/sparkles";
// Hook do next-themes para obter o tema atual (claro/escuro).
import { useTheme } from "next-themes";

/**
 * @file TeamHero.tsx - Componente Hero da Seção "Nossa Equipe".
 * @module components/TeamHero (ou o caminho apropriado)
 *
 * @description
 * O componente `TeamHero` renderiza uma seção de destaque (hero section) com o título
 * "Nossa Equipe". Ele é projetado para ser visualmente atraente, utilizando
 * o componente `SparklesCore` para um efeito de partículas animadas e diversos
 * gradientes para criar um visual moderno e dinâmico.
 *
 * A cor das partículas se adapta automaticamente ao tema atual da aplicação
 * (branco para tema escuro, preto para tema claro) através do hook `useTheme`.
 *
 * Um gradiente radial é aplicado sobre as partículas para suavizar as bordas
 * do efeito, criando uma transição mais natural para o fundo.
 *
 * Este componente não recebe props.
 *
 * @returns {JSX.Element} Um `div` contendo o título e os efeitos visuais da seção hero.
 *
 * @example
 * // Em uma página "Sobre Nós" ou "Equipe":
 * import { TeamHero } from '@/components/TeamHero';
 *
 * export default function TeamPage() {
 *   return (
 *     <>
 *       <TeamHero />
 *       {/* ... restante do conteúdo da página da equipe ... *\/}
 *     </>
 *   );
 * }
 */
export function TeamHero() {
  // Obtém o tema atual (ex: "light", "dark") usando o hook `useTheme`.
  const { theme } = useTheme();

  // Define a cor das partículas com base no tema atual.
  // Se o tema for "dark", a cor das partículas será branca (#FFFFFF).
  // Caso contrário (tema "light" ou "system" resolvido para "light"), será preta (#000000).
  const particleColor = theme === "dark" ? "#FFFFFF" : "#000000";

  return (
    // Container principal da seção hero.
    // Define altura, largura total, fundo transparente (para dark mode), e centraliza o conteúdo.
    // `overflow-hidden` é importante para conter os efeitos visuais.
    <div className="h-[30rem] sm:h-[40rem] w-full dark:bg-transparent flex flex-col items-center justify-center overflow-hidden rounded-md my-16 md:my-24"> {/* Altura responsiva e margem vertical */}
      {/* Título principal da seção.
          Posicionado com z-index para ficar acima das partículas e gradientes. */}
      <h1 className="md:text-7xl text-4xl lg:text-8xl font-bold text-center text-gray-800 dark:text-white relative z-20"> {/* Ajustado tamanho de texto e cor para light mode */}
        Nossa Equipe
      </h1>
      {/* Container para os efeitos visuais (gradientes e partículas). */}
      <div className="w-full max-w-md sm:w-[40rem] h-40 relative mt-4"> {/* Largura responsiva e margem superior */}
        {/* Efeitos de Gradiente:
            Estes criam linhas de luz sutis e decorativas acima das partículas.
            Utilizam `blur-sm` para um efeito de brilho suave. */}
        <div className="absolute inset-x-10 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-10 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-30 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-30 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Componente `SparklesCore`:
            Renderiza o efeito de partículas animadas.
            - `background="transparent"`: As partículas são renderizadas sobre um fundo transparente.
            - `minSize`, `maxSize`: Define o intervalo de tamanho das partículas.
            - `particleDensity`: Controla a densidade das partículas.
            - `className="w-full h-full"`: Faz o componente ocupar todo o espaço do container pai.
            - `particleColor={particleColor}`: Define a cor das partículas dinamicamente com base no tema. */}
        <SparklesCore
          id="teamHeroSparkles" // Adicionado um ID para unicidade se houver múltiplos SparklesCore na página
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor={particleColor}
        />

        {/* Máscara com Gradiente Radial:
            Este div é posicionado sobre as partículas e aplica uma máscara com gradiente radial.
            O objetivo é suavizar as bordas do efeito de partículas, fazendo com que elas
            desapareçam gradualmente em direção às bordas do container, em vez de terem um corte abrupto.
            A cor de fundo (bg-white/dark:bg-[#000]) é o que será "mascarado".
            `[mask-image:radial-gradient(...)]` define a forma da máscara. */}
        <div
          className="absolute inset-0 w-full h-full bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:[mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]"
          aria-hidden="true" // Elemento puramente decorativo
        ></div>
      </div>
    </div>
  );
}// Indica que este é um Client Component no Next.js App Router.
// Necessário para o hook `useTheme` e para o componente `SparklesCore`
// que provavelmente lida com animações e interações do lado do cliente.
"use client";

import React from "react";
// Importa o componente que gera o efeito de partículas animadas.
import { SparklesCore } from "../ui/sparkles";
// Hook do next-themes para obter o tema atual (claro/escuro).
import { useTheme } from "next-themes";

/**
 * @file TeamHero.tsx - Componente Hero da Seção "Nossa Equipe".
 * @module components/TeamHero (ou o caminho apropriado)
 *
 * @description
 * O componente `TeamHero` renderiza uma seção de destaque (hero section) com o título
 * "Nossa Equipe". Ele é projetado para ser visualmente atraente, utilizando
 * o componente `SparklesCore` para um efeito de partículas animadas e diversos
 * gradientes para criar um visual moderno e dinâmico.
 *
 * A cor das partículas se adapta automaticamente ao tema atual da aplicação
 * (branco para tema escuro, preto para tema claro) através do hook `useTheme`.
 *
 * Um gradiente radial é aplicado sobre as partículas para suavizar as bordas
 * do efeito, criando uma transição mais natural para o fundo.
 *
 * Este componente não recebe props.
 *
 * @returns {JSX.Element} Um `div` contendo o título e os efeitos visuais da seção hero.
 *
 * @example
 * // Em uma página "Sobre Nós" ou "Equipe":
 * import { TeamHero } from '@/components/TeamHero';
 *
 * export default function TeamPage() {
 *   return (
 *     <>
 *       <TeamHero />
 *       {/* ... restante do conteúdo da página da equipe ... *\/}
 *     </>
 *   );
 * }
 */
export function TeamHero() {
  // Obtém o tema atual (ex: "light", "dark") usando o hook `useTheme`.
  const { theme } = useTheme();

  // Define a cor das partículas com base no tema atual.
  // Se o tema for "dark", a cor das partículas será branca (#FFFFFF).
  // Caso contrário (tema "light" ou "system" resolvido para "light"), será preta (#000000).
  const particleColor = theme === "dark" ? "#FFFFFF" : "#000000";

  return (
    // Container principal da seção hero.
    // Define altura, largura total, fundo transparente (para dark mode), e centraliza o conteúdo.
    // `overflow-hidden` é importante para conter os efeitos visuais.
    <div className="h-[30rem] sm:h-[40rem] w-full dark:bg-transparent flex flex-col items-center justify-center overflow-hidden rounded-md my-16 md:my-24"> {/* Altura responsiva e margem vertical */}
      {/* Título principal da seção.
          Posicionado com z-index para ficar acima das partículas e gradientes. */}
      <h1 className="md:text-7xl text-4xl lg:text-8xl font-bold text-center text-gray-800 dark:text-white relative z-20"> {/* Ajustado tamanho de texto e cor para light mode */}
        Nossa Equipe
      </h1>
      {/* Container para os efeitos visuais (gradientes e partículas). */}
      <div className="w-full max-w-md sm:w-[40rem] h-40 relative mt-4"> {/* Largura responsiva e margem superior */}
        {/* Efeitos de Gradiente:
            Estes criam linhas de luz sutis e decorativas acima das partículas.
            Utilizam `blur-sm` para um efeito de brilho suave. */}
        <div className="absolute inset-x-10 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-10 sm:inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-30 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-30 sm:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Componente `SparklesCore`:
            Renderiza o efeito de partículas animadas.
            - `background="transparent"`: As partículas são renderizadas sobre um fundo transparente.
            - `minSize`, `maxSize`: Define o intervalo de tamanho das partículas.
            - `particleDensity`: Controla a densidade das partículas.
            - `className="w-full h-full"`: Faz o componente ocupar todo o espaço do container pai.
            - `particleColor={particleColor}`: Define a cor das partículas dinamicamente com base no tema. */}
        <SparklesCore
          id="teamHeroSparkles" // Adicionado um ID para unicidade se houver múltiplos SparklesCore na página
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor={particleColor}
        />

        {/* Máscara com Gradiente Radial:
            Este div é posicionado sobre as partículas e aplica uma máscara com gradiente radial.
            O objetivo é suavizar as bordas do efeito de partículas, fazendo com que elas
            desapareçam gradualmente em direção às bordas do container, em vez de terem um corte abrupto.
            A cor de fundo (bg-white/dark:bg-[#000]) é o que será "mascarado".
            `[mask-image:radial-gradient(...)]` define a forma da máscara. */}
        <div
          className="absolute inset-0 w-full h-full bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:[mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]"
          aria-hidden="true" // Elemento puramente decorativo
        ></div>
      </div>
    </div>
  );
}