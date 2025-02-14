"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-auto rounded-md  flex flex-col antialiased items-center justify-center relative overflow-hidden w-screen">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        className="invert dark:invert-0"
      />
    </div>
  );
}

const testimonials = [
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
];
