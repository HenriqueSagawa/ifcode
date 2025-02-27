'use client'

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import Link from "next/link";
import YoutubeIfcode from "../../../public/img/capa if code vídeo.jpg"

/**
 * Componente que exibe as principais features/funcionalidades do site.
 *
 * Este componente renderiza uma seção com cards que destacam as features do IF Code,
 * como resolução de dúvidas, compartilhamento de conhecimento, canal no YouTube e interação em tempo real.
 *
 * @returns {JSX.Element} A seção de features renderizada.
 */
export function Feature() {
  // Array com os dados de cada feature.
  const features = [
    {
      title: "Resolva dúvidas de forma eficiente",
      description:
        "Encontre respostas para suas perguntas e acompanhe discussões sobre programação. Publique suas dúvidas e receba ajuda da comunidade.",
      skeleton: <SkeletonOne />, // Componente para exibir um "esqueleto" de carregamento.
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800", // Classes CSS para estilização e layout.
    },
    {
      title: "Compartilhe conhecimento",
      description:
        "Ajude outros estudantes postando dicas, tutoriais e soluções para desafios técnicos. O IF Code é um espaço colaborativo feito por e para alunos de informática.",
      skeleton: <SkeletonTwo />, // Componente para exibir um "esqueleto" de carregamento.
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800", // Classes CSS para estilização e layout.
    },
    {
      title: "Acompanhe nosso canal no YouTube",
      description:
        "Quer aprender de forma prática? Assista a vídeos explicativos no nosso canal e aprimore suas habilidades com conteúdos feitos especialmente para você.",
      skeleton: <SkeletonThree />, // Componente para exibir um "esqueleto" de carregamento.
      className:
        "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800", // Classes CSS para estilização e layout.
    },
    {
      title: "Interaja em tempo real",
      description:
        "Com um sistema dinâmico e intuitivo, você pode comentar, responder e interagir com a comunidade rapidamente. Construa conexões e aprenda junto!",
      skeleton: <SkeletonFour />, // Componente para exibir um "esqueleto" de carregamento.
      className: "col-span-1 lg:col-span-3 border-b lg:border-none", // Classes CSS para estilização e layout.
    },
  ];

  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          Repleto de funcionalidades
        </h4>

        <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          No IF Code, você encontra suporte, troca experiências e soluciona dúvidas com a ajuda de outros estudantes. Compartilhe seu conhecimento e aprenda com a comunidade!
        </p>
      </div>

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
          {/* Mapeia o array de features e renderiza um componente FeatureCard para cada uma. */}
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Componente para renderizar um card de feature individual.
 *
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} [props.children] - Os elementos filhos a serem renderizados dentro do card.
 * @param {string} [props.className] - Classes CSS adicionais para estilizar o card.
 * @returns {JSX.Element} O card de feature renderizado.
 */
const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

/**
 * Componente para renderizar o título de uma feature.
 *
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} [props.children] - O texto do título.
 * @returns {JSX.Element} O título da feature renderizado.
 */
const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

/**
 * Componente para renderizar a descrição de uma feature.
 *
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} [props.children] - O texto da descrição.
 * @returns {JSX.Element} A descrição da feature renderizada.
 */
const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

/**
 * Componente que exibe um "esqueleto" de carregamento para a primeira feature.
 *
 * Este componente renderiza uma imagem e um gradiente para simular o carregamento do conteúdo.
 *
 * @returns {JSX.Element} O esqueleto de carregamento renderizado.
 */
export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full  p-5  mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
          {/* TODO */}
          <Image
            src="/img/fotoifcodecapa.jpg"
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover rounded-sm"
          />
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

/**
 * Componente que exibe um "esqueleto" de carregamento para a terceira feature (canal do YouTube).
 *
 * Este componente renderiza um link para o canal do YouTube com um ícone e uma imagem de capa borrada.
 *
 * @returns {JSX.Element} O esqueleto de carregamento renderizado.
 */
export const SkeletonThree = () => {
  return (
    <Link
      href="https://www.youtube.com/playlist?list=PLQCg2eNNnukPWBYmgQ4m_OWps4W2szYo1"
      target="__blank"
      className="relative flex gap-10  h-full group/image"
    >
      <div className="w-full  mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
          {/* TODO */}
          <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto " />
          <Image
            src={YoutubeIfcode}
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
          />
        </div>
      </div>
    </Link>
  );
};

/**
 * Componente que exibe um "esqueleto" de carregamento para a segunda feature (compartilhamento de conhecimento).
 *
 * Este componente renderiza uma galeria de imagens com um efeito de rotação e sobreposição.
 *
 * @returns {JSX.Element} O esqueleto de carregamento renderizado.
 */
export const SkeletonTwo = () => {
  const images = [
    "/img/equipeifcode.jpg",
    "/img/ifcodefoto1.jpg",
    "/img/ifcodefoto2.jpg",
    "/img/ifcodefoto3.jpg",
    "/img/ifcodefoto4.jpg",
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      {/* TODO */}
      <div className="flex flex-row -ml-20">
        {images.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <Image
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <Image
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
    </div>
  );
};

/**
 * Componente que exibe um "esqueleto" de carregamento para a quarta feature (interação em tempo real).
 *
 * Este componente renderiza um globo interativo usando a biblioteca `cobe`.
 *
 * @returns {JSX.Element} O esqueleto de carregamento renderizado.
 */
export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

/**
 * Componente que renderiza um globo interativo.
 *
 * Este componente utiliza a biblioteca `cobe` para criar um globo 3D que pode ser interativo.
 *
 * @param {object} props - As propriedades do componente.
 * @param {string} [props.className] - Classes CSS adicionais para estilizar o globo.
 * @returns {JSX.Element} O globo interativo renderizado.
 */
export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null); // Referência para o elemento canvas.

  useEffect(() => {
    let phi = 0; // Ângulo de rotação do globo.

    if (!canvasRef.current) return; // Garante que o canvas está disponível.

    // Inicializa o globo usando a biblioteca `cobe`.
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state: any) => {
        // Chamado em cada frame de animação.
        // Atualiza o ângulo de rotação do globo.
        state.phi = phi;
        phi += 0.01;
      },
    });

    // Função para destruir o globo quando o componente é desmontado.
    return () => {
      globe.destroy();
    };
  }, []); // Executa apenas uma vez quando o componente é montado.

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
