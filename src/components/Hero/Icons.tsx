// Diretiva do Next.js para Client Component, pode ser necessária se os
// sub-componentes importados (HeroCards, LinkPreview, InfiniteMovingCardsDemo)
// usarem hooks ou interações do lado do cliente.
"use client";

// Importações de Componentes e Bibliotecas
import { Button } from "@heroui/button"; // Componente Botão (assumindo HeroUI ou similar)
import { HeroCards } from "../HeroCards"; // Componente customizado para exibir cards no Hero (desktop)
import1-.45-.15-.69-.1-.88.08-1.17.46-1.36a2,2,0,0,1,.28-.11c.3-.08.6.25.77.78s.31.79.44,1.18l.52,1.14a14.06,14.06,0,0,0,1.26,2.15,13.81,13.81,0,0,0,2.52,2.84Z"
        />
      </g>
    </svg>
  );
};

// --- ChartIcon ---

/**
 * Componente que renderiza um ícone SVG de um gráfico (possivelmente de barras ou linha).
 * O tamanho é definido pela classe Tailwind `w-12`.
 * A cor de preenchimento principal é definida pela classe `fill-primary`.
 * A classe `cls-1` pode ter estilos específicos definidos externamente.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX representando o ícone SVG de gráfico.
 */
export const ChartIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" // Namespace SVG padrão
      viewBox="0 0 128 128" // Define a caixa de visualização interna do SVG
      // Classes CSS (Tailwind): define a largura e a cor de preenchimento principal
      className="w-12 fill-primary"
    >
      {/* Título SVG */}
      <title>Chart Icon</title> {/* Título descritivo */}
      {/* Grupo de elementos SVG */}
      <g
        id="Layer_10" // ID da camada
        data-name="Layer 10" // Nome da camada
 { GitHubLogoIcon } from "@radix-ui/react-icons"; // Ícone do GitHub da biblioteca Radix
import { InfiniteMovingCardsDemo } from "../MovingCards"; // Componente customizado para cards móveis (mobile)
import { MoveRight } from "lucide-react"; // Ícone de seta da biblioteca Lucide
import { LinkPreview } from "../ui/link-preview"; // Componente customizado para preview de links (provavelmente com tooltip/hover)
import Link from "next/link"; // Componente Link do Next.js para navegação client-side
import React from "react"; // Importa React

/**
 * Componente que representa a seção "Hero" principal da página (geralmente a homepage).
 * Exibe um título chamativo com efeito de gradiente, uma descrição concisa,
 * botões de chamada para ação (CTA), e elementos visuais dinâmicos que
 * se adaptam ao tamanho da tela (`HeroCards` ou `InfiniteMovingCardsDemo`).
 * Utiliza um layout de grid responsivo.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX da seção Hero.
 */
export const Hero = () => {
  return (
    // Container principal da seção com grid responsivo, centralização e espaçamento.
    <section className="container mx-auto grid grid-cols-1 xl:grid-cols-2 place-items-center py-20 md:py-32 gap-10">

      {/* Coluna Esquerda: Conteúdo textual */}
      <div className="text-center xl:text-start space-y-6">
        {/* Bloco principal do título */}
        <main className="relative text-4xl md:text-6xl font-bold">
          {/* Primeira linha do título */}
          <h1 className="inline">
            {      >
        {/* Paths que definem a forma complexa do gráfico */}
        <path
          className="cls-1" // Classe CSS específica
          d="M21.55,80.68c.08-4.89.14-9.73.08-14.61l-.11-5.33c-.07-6.26-.16-12.52-.39-18.78-.1-2.78-.27-5.57-.5-8.31-.33-3.52-.62-7.07-.9-10/* Span com efeito de gradiente no texto */}
            <span className="inline bg-gradient-to-r from-[#80C342] to-[#118B44] text-transparent bg-clip-text">
              IF Code
            </span>{" "}
            Solucione suas
          </h1>{" "}
          {/* Segunda linha do título */}
          <h2 className="inline">
             {/* Span com efeito de gradiente diferente no texto */}
            <span className="inline bg-gradient-to-r from-[#ffba08] via-[#faa307] to-[#f48c06] text-transparent bg-clip-text">
              Dúvidas
            </span>{" "}
            de forma rápida
          </h2>
        </main>

        {/* Parágrafo descritivo */}
        <p className="text-xl text-muted-foreground w-[.53-.07-1.08.21-1,.77-.19a180%] md:w-10/12 mx-auto lg:mx-auto xl:mx-0">
          Tire dúvidas, compartilhe conhecimento e encontre suporte para seus desafios em informática, tudo de forma rápida e acess0.42,10.42,0,0,1,1.64,4.58A107.94,107.94,0,0,1,23,38.41q.24,5.45.26,10.93c0,4ível!
        </p>

        {/* Container para os botões de ação (CTA) */}
        {.37.25,8.92.33,13.39.09,4.91.13,9.84.08,14.76,0,3/* Ajusta espaçamento e layout baseado no tamanho da tela */}
        <div className="space-y-4 md-.06,6,0,9.06.05,4.57.13,9.1:space-y-0 md:space-x-4">
          {/* Botão "Comece já" -6.5,13.67.29,3.51.81,6.92, Link para a página de posts */}
          <Link href="/posts" passHref> {/* `passHref` é importante1.4,10.34.14.75.27,1.49.4 se Button não renderizar `<a>` */}
            <Button className="w-[80%] md:w-11,2.24.49,2.82.54,3.73,0,4.45a3.13,3.13,0,0,1-.35.48c-.4/3 !bg-zinc-900 dark:!bg-zinc-50 text-zinc-50 dark3.36-1-.72-1.54-2.78a104.7:text-zinc-900 flex items-center gap-1"> {/* Estilo customizado com ! e2,104.72,0,0,1-2.42-19.44c-. ícone */}
              Comece já <MoveRight className="h-4 w-4 ml-1" /> {/*23-4.94-.19-9.89-.18-14.82Z"
 Ícone MoveRight */}
            </Button>
          </Link>

          {/* Botão "Repositório do Github        />
       {/* ... outros paths cls-1 ... */}
        <path
          className="cls-1"
          d="M96.44,12.56l0-.14," - Usa LinkPreview */}
          <Button color="default" variant="ghost" className="w-[80%]0-.08c0-.05,0-.11,0-.18s-.08,0 md:w-1/3 ">
            {/* Componente LinkPreview para exibir preview do link do GitHub */}-.13,0a1.44,1.44,0,0,0-.29.1
            <LinkPreview
              url="https://github.com/IFcode-Assis" // URL do repos1c-.48.27-1,.57-1.46.81A20.7itório
              className="flex items-center" // Estilo para alinhar ícone e texto
            >
              7,20.77,0,0,1,89,14.8c-.8Repositório do Github
              <GitHubLogoIcon className="ml-2 w-5 h-5" /> {/* Í6.14-1.72.29-2.57.39a11.4cone do GitHub */}
            </LinkPreview>
          </Button>
        </div>
      </div>

      {,11.4,0,0,1-3.3.07c-.34,0/* Coluna Direita: Elementos Visuais (HeroCards ou InfiniteMovingCardsDemo) */}
      {/* z-.29-.36,0-.7a2.31,2.31,0,0-10 pode ser para garantir que fique sobre o efeito de sombra */}
      <div className="z-10 w,1,1.38-.8c2.12-.29,4.17-.65,6.26-1.08a14.74,14.74,0,0,0-full flex justify-center xl:justify-end"> {/* Ajustado para controle de alinhamento */}
        {/* Render,3.6-1.49l.74-.4,1.09-.62ciza HeroCards APENAS em telas extra-grandes (xl) ou maiores */}
        <div className="hidden xl:block">
          <HeroCards />
        </div>
        {/* Renderiza InfiniteMovingCardsDemo.4-.22.78-.44,1.16-.63A11.3 em telas MENORES que extra-grandes */}
        <div className="block xl:hidden w-full max-3,11.33,0,0,1,98.44,9l-.13,1.79-.13,2-.11,1.39a26.59,26.w-lg"> {/* Limitando largura no mobile/tablet */}
          <InfiniteMovingCardsDemo />
        </div>
      </div>59,0,0,1-.72,4.22,18.25,18

      {/* Elemento para efeito de sombra (provavelmente posicionado absolutamente via CSS) */}
      <div className.25,0,0,1-1,3.19,5.79,5.79,0,0,1-.31.67c-.46.81-.78.95-="shadow"></div> {/* Comentário: Provavelmente um efeito visual decorativo, precisa de CSS para confirmar. */}
    1.28.82-.11,0-.23-.06-.34-.11-.</section>
  );
};