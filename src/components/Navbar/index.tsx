// Indica que este é um Client Component no Next.js App Router.
// Necessário para o componente InfiniteMovingCards que provavelmente
// usa hooks de cliente para animação e interatividade.
"use client";

import React from "react";
// Importa o componente principal que realiza a animação de carrossel infinito.
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

/**
 * @interface Testimonial
 * @description Define a estrutura de um objeto de depoimento (ou item similar)
 *              a ser exibido pelo componente `InfiniteMovingCards`.
 */
interface Testimonial {
  /**
   * @prop {string} quote - O texto principal do depoimento ou item.
   */
  quote: string;
  /**
   * @prop {string} name - O nome associado ao depoimento (pode ser o autor, um título de seção, etc.).
   */
  name: string;
  /**
   * @prop {string} title - Um título ou subtítulo adicional para o depoimento.
   */
  title: string;
}

/**
 * @constant testimonials
 * @description Um array de objetos `Testimonial` contendo os dados a serem exibidos
 *              no carrossel de cartões móveis infinitos.
 *              Cada objeto representa um cartão no carrossel.
 */
const testimonials: Testimonial[] = [
  {
    quote:
      "O IF Code é uma plataforma desenvolvida para ajudar estudantes do IFPR Campus Assis Chateaubriand com suas dúvidas de programação, oferecendo suporte através de inteligência artificial e uma comunidade colaborativa.",
    name: "Sobre o IF Code",
    title: "Plataforma de Ensino",
  },
  {
    quote:
      "Utilize nossa IA integrada com o Gemini para obter respostas rápidas e precisas sobre programação, algoritmos, estruturas de dados e muito mais. Tire suas dúvidas 24 horas por dia.",
    name: "Inteligência Artificial",
    title: "Suporte Contínuo",
  },
  {
    quote:
      "Faça parte de uma comunidade ativa de estudantes e professores do IFPR Assis Chateaubriand. Compartilhe conhecimento, participe de discussões e cresça junto com outros desenvolvedores.",
    name: "Comunidade",
    title: "Aprendizado Colaborativo",
  },
  // Você pode adicionar mais depoimentos/itens aqui conforme necessário.
  // Exemplo:
  // {
  //   quote: "Este é um quarto depoimento para testar o fluxo contínuo.",
  //   name: "Usuário Teste",
  //   title: "Feedback Adicional",
  // },
];


/**
 * @file InfiniteMovingCardsDemo.tsx - Componente de Demonstração para `InfiniteMovingCards`.
 * @module components/demos/InfiniteMovingCardsDemo (ou o caminho apropriado)
 *
 * @description
 * O componente `InfiniteMovingCardsDemo` serve como um exemplo de uso e configuração
 * do componente `InfiniteMovingCards`. Ele exibe uma série de "depoimentos"
 * (ou informações sobre o projeto IF Code) em um carrossel que se move continuamente.
 *
 * Este componente configura as seguintes propriedades do `InfiniteMovingCards`:
 * - `items`: O array de dados a serem exibidos (neste caso, `testimonials`).
 * - `direction`: A direção do movimento dos cartões ("right" ou "left").
 * - `speed`: A velocidade do movimento ("fast", "normal", "slow").
 * - `className`: Classes CSS adicionais para estilização (aqui, para inverter cores em tema claro).
 *
 * O container principal do demo também possui estilização para centralizar o carrossel
 * e gerenciar o overflow.
 *
 * Este componente não recebe props.
 *
 * @returns {JSX.Element} Um `div` contendo o componente `InfiniteMovingCards` configurado.
 *
 * @example
 * // Em uma página ou seção onde você quer exibir o carrossel:
 * import { InfiniteMovingCardsDemo } from '@/components/demos/InfiniteMovingCardsDemo';
 *
 * export default function HomePage() {
 *   return (
 *     <section>
 *       <h2 className="text-2xl font-bold text-center my-8">O que oferecemos</h2>
 *       <InfiniteMovingCardsDemo />
 *     </section>
 *   );
 * }
 */
export function InfiniteMovingCardsDemo() {
  return (
    // Container principal para o componente de demonstração.
    // Estilizado para ter altura automática, cantos arredondados (embora 'h-auto' e 'rounded-md'
    // possam ser sobrescritos ou menos visíveis dependendo do conteúdo interno e do contexto).
    // Usa flexbox para centralizar o conteúdo.
    // `relative overflow-hidden`: Necessário para o funcionamento correto de alguns tipos de animação
    // e para garantir que o conteúdo que se move para fora da tela seja cortado.
    // `w-screen`: Faz o container ocupar a largura total da tela.
    // `antialiased`: Melhora a renderização do texto.
    <div className="h-auto rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden w-screen py-8 md:py-12"> {/* Adicionado padding vertical */}
      {/*
        Componente `InfiniteMovingCards` sendo utilizado.
        - `items={testimonials}`: Passa os dados dos depoimentos para o componente.
        - `direction="right"`: Define que os cartões se moverão da esquerda para a direita.
        - `speed="slow"`: Define a velocidade da animação como lenta.
        - `className="invert dark:invert-0"`:
            - `invert`: Inverte as cores dos cartões no tema claro (ex: texto preto sobre fundo branco se torna branco sobre preto).
            - `dark:invert-0`: Remove a inversão no tema escuro, mantendo as cores originais do componente.
              Isso é útil se o componente `InfiniteMovingCards` já tiver um design adequado para o tema escuro.
      */}
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        className="invert dark:invert-0" // Classe para ajuste de cores em temas claro/escuro
      />
    </div>
  );
}