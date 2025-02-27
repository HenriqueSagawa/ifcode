"use client";

import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

/**
 * Componente que renderiza uma demonstração de cards em movimento infinito.
 *
 * Este componente utiliza o componente `InfiniteMovingCards` para exibir um conjunto de cards
 * com depoimentos/informações sobre o IF Code, criando um efeito visual de rolagem contínua.
 *
 * @returns {JSX.Element} A demonstração de cards em movimento infinito renderizada.
 */
export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-auto rounded-md  flex flex-col antialiased items-center justify-center relative overflow-hidden w-screen">
      {/* Container principal para os cards em movimento. */}
      <InfiniteMovingCards
        items={testimonials} // Array de depoimentos/informações a serem exibidas nos cards.
        direction="right" // Define a direção da rolagem (da esquerda para a direita).
        speed="slow" // Define a velocidade da rolagem.
        className="invert dark:invert-0" // Inverte as cores para melhor visualização em temas escuros.
      />
    </div>
  );
}

// Array de depoimentos/informações a serem exibidas nos cards.
const testimonials = [
  {
    quote:
      "O IF Code é uma plataforma desenvolvida para ajudar estudantes do IFPR Campus Assis Chateaubriand com suas dúvidas de programação, oferecendo suporte através de inteligência artificial e uma comunidade colaborativa.",
    name: "Sobre o IF Code",
    title: "Plataforma de Ensino",
  },
  {
    quote:
      "Utilize nossa IA integrada com o Gemini para obter respostas rápidas e
