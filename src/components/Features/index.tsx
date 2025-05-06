// Diretiva do Next.js para Client Component, necessária para os hooks (useRef, useEffect, useState, useMotionValue) usados nos sub-componentes, especialmente no Globe.
'use client'

import React from "react"; // Importa React
import { cn } from "@/lib/utils"; // Utilitário para concatenar classes condicionalmente
import Image from "next/image"; // Componente otimizado de imagem do Next.js
import createGlobe from "cobe"; // Biblioteca para criar a visualização do globo 3D
import { useEffect, useRef, useState } from "react"; // Hooks do React
import { motion, useMotionValue } from "framer-motion"; // Biblioteca para animações e interações (usada em SkeletonTwo e Globe)
import { IconBrandYoutubeFilled } from "@tabler/icons-react"; // Ícone do YouTube
import Link from "next/link"; // Componente Link do Next.js para navegação client-side

// (Importação da imagem do YouTube - ajuste o caminho se necessário)
// import YoutubeIfcode from "../../../public/img/capa if code vídeo.jpg" // Não usado diretamente no código fornecido, mas importado

// --- Componente Principal ---

/**
 * Componente que renderiza a seção "Repleto de funcionalidades" na página.
 * Exibe um título, descrição e um grid responsivo de cards (`FeatureCard`),
 * cada um destacando uma funcionalidade diferente com um visual único (`skeleton`).
 * Os dados das funcionalidades são definidos internamente no array `features`.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX da seção de funcionalidades.
 */
export function Feature() {
  // Array definindo os dados para cada card de funcionalidade.
  const features = [
    {
      title: "Resolva dúvidas de forma eficiente",
      description: "Encontre respostas para suas perguntas e acompanhe discussões sobre programação. Publique suas dúvidas e receba ajuda da comunidade.",
      skeleton: <SkeletonOne />, // Componente visual para este card
      className: "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800", // Classes de layout e borda
    },
    {
      title: "Compartilhe conhecimento",
      description: "Ajude outros estudantes postando dicas, tutoriais e soluções para desafios técnicos. O IF Code é um espaço colaborativo feito por e para alunos de informática.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Acompanhe nosso canal no YouTube",
      description: "Quer aprender de forma prática? Assista a vídeos explicativos no nosso canal e aprimore suas habilidades com conteúdos feitos especialmente para você.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
    },
    {
      title: "Interaja em tempo real",
      description: "Com um sistema dinâmico e intuitivo, você pode comentar, responder e interagir com a comunidade rapidamente. Construa conexões e aprenda junto!",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none", // Ajustado para remover borda inferior no último item da linha visual
    },
  ];

  return (
    // Container principal da seção com padding e largura máxima.
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      {/* Bloco de texto introdutório */}
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          Repleto de funcionalidades
        </h4>
        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          No IF Code, você encontra suporte, troca experiências e soluciona dúvidas com a ajuda de outros estudantes. Compartilhe seu conhecimento e aprenda com a comunidade!
        </p>
      </div>

      {/* Container do grid de funcionalidades */}
      <div className="relative ">
        {/* Grid responsivo (1 coluna mobile, 6 colunas lg) com borda opcional */}
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
          {/* Mapeia o array `features` para renderizar cada card */}
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              {/* Renderiza o componente visual (skeleton) específico para este card */}
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Sub-componentes de Estrutura do Card ---

/**
 * Componente wrapper para cada card individual no grid de funcionalidades.
 * Aplica padding, posicionamento relativo e permite classes customizadas.
 *
 * @component
 * @param {object} props - Propriedades do componente.
 * @param {React.ReactNode} [props.children] - Elementos filhos a serem renderizados dentro do card.
 * @param {string} [props.className] - Classes CSS adicionais para customização do layout/estilo.
 * @returns {JSX.Element} O elemento JSX do card de funcionalidade.
 */
const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  // Usa `cn` para mergear classes padrão com as classes customizadas passadas via props.
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

/**
 * Componente para renderizar o título dentro de um FeatureCard.
 * Aplica estilos de texto específicos para o título.
 *
 * @component
 * @param {{ children?: React.ReactNode }} props - Propriedades do componente.
 * @returns {JSX.Element} O elemento JSX do título.
 */
const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug font-medium"> {/* Adicionado font-medium */}
      {children}
    </p>
  );
};

/**
 * Componente para renderizar a descrição dentro de um FeatureCard.
 * Aplica estilos de texto específicos para a descrição.
 *
 * @component
 * @param {{ children?: React.ReactNode }} props - Propriedades do componente.
 * @returns {JSX.Element} O elemento JSX da descrição.
 */
const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  // Usa `cn` para aplicar múltiplos conjuntos de classes Tailwind.
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto", // Estilos base e largura
        "text-neutral-500 dark:text-neutral-300", // Cores
        "text-left max-w-sm mx-0 my-2" // Ajustes finos de alinhamento, largura e margem
      )}
    >
      {children}
    </p>
  );
};

// --- Componentes "Skeleton" (Conteúdo Visual dos Cards) ---

/**
 * Skeleton/Visual para o primeiro card ("Resolva dúvidas").
 * Exibe uma imagem estática com gradientes superior e inferior para efeito visual.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX do SkeletonOne.
 */
export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      {/* Container da imagem com sombra */}
      <div className="w-full p-5 mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full rounded-md"> {/* Adicionado rounded-md */}
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          {/* Imagem principal */}
          <Image
            src="/img/fotoifcodecapa.jpg" // Caminho da imagem
            alt="Ilustração da plataforma IF Code" // Alt text descritivo
            width={400}
            height={400}
            className="w-full h-full aspect-square object-cover rounded-sm"
            priority // Considerar adicionar priority se for LCP
          />
        </div>
      </div>

      {/* Gradiente inferior (fade para branco/preto) */}
      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white/80 dark:via-black/80 to-transparent w-full pointer-events-none" />
      {/* Gradiente superior (fade para branco/preto) */}
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

/**
 * Skeleton/Visual para o segundo card ("Compartilhe conhecimento").
 * Exibe duas fileiras de imagens sobrepostas e rotacionadas aleatoriamente,
 * com efeito de escala no hover usando Framer Motion. Inclui gradientes laterais.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX do SkeletonTwo.
 */
export const SkeletonTwo = () => {
  // Array com os caminhos das imagens a serem exibidas.
  const images = [
    "/img/equipeifcode.jpg",
    "/img/ifcodefoto1.jpg",
    "/img/ifcodefoto2.jpg",
    "/img/ifcodefoto3.jpg",
    "/img/ifcodefoto4.jpg",
  ];

  // Variantes de animação para Framer Motion (efeito de escala no hover/tap).
  const imageVariants = {
    whileHover: { scale: 1.1, rotate: 0, zIndex: 100 },
    whileTap: { scale: 1.1, rotate: 0, zIndex: 100 },
  };

  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      {/* Primeira fileira de imagens */}
      <div className="flex flex-row -ml-20">
        {images.map((image, idx) => (
          // Componente `motion.div` para aplicar animações.
          <motion.div
            variants={imageVariants} // Aplica as variantes de animação
            key={"images-first" + idx} // Chave única
            style={{ rotate: Math.random() * 20 - 10 }} // Rotação inicial aleatória
            whileHover="whileHover" // Estado de animação no hover
            whileTap="whileTap" // Estado de animação no clique/tap
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden shadow-md" // Estilização
          >
            <Image
              src={image}
              alt="Imagens da comunidade IF Code" // Alt text genérico
              width="500" // Largura intrínseca (para cálculo de aspect ratio)
              height="500" // Altura intrínseca
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0" // Tamanho e ajuste da imagem
            />
          </motion.div>
        ))}
      </div>
      {/* Segunda fileira de imagens (similar à primeira) */}
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{ rotate: Math.random() * 20 - 10 }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden shadow-md"
          >
            <Image
              src={image}
              alt="Imagens da comunidade IF Code"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>

      {/* Gradiente lateral esquerdo */}
      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent h-full pointer-events-none" />
      {/* Gradiente lateral direito */}
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent h-full pointer-events-none" />
    </div>
  );
};

/**
 * Skeleton/Visual para o terceiro card ("Acompanhe nosso canal no YouTube").
 * Exibe uma imagem de banner com um ícone do YouTube sobreposto.
 * O card inteiro é um link para a playlist do YouTube, com efeito de blur na imagem no hover.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX do SkeletonThree.
 */
export const SkeletonThree = () => {
  return (
    // Link envolvendo todo o card, com `group/image` para controlar hover na imagem interna.
    <Link
      href="https://www.youtube.com/playlist?list=PLQCg2eNNnukPWBYmgQ4m_OWps4W2szYo1" // URL da playlist
      target="_blank" // Abre em nova aba
      rel="noopener noreferrer" // Boas práticas de segurança para target="_blank"
      className="relative flex gap-10 h-full group/image w-full" // Permite que o link ocupe o espaço
    >
      {/* Container interno */}
      <div className="w-full mx-auto bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2 relative">
          {/* Ícone do YouTube posicionado absolutamente no centro */}
          <IconBrandYoutubeFilled className="h-16 w-16 sm:h-20 sm:w-20 absolute z-10 inset-0 text-red-500 m-auto drop-shadow-lg" />
          {/* Imagem de fundo com efeito de blur no hover do link pai */}
          <Image
            src="/img/ifcodebanner.png" // Caminho do banner
            alt="Banner do canal IF Code no YouTube" // Alt text descritivo
            width={800}
            height={800}
            className="h-full w-full aspect-video object-contain rounded-sm blur-none group-hover/image:blur-md transition-all duration-200" // `aspect-video` para proporção, efeito de blur
          />
        </div>
      </div>
    </Link>
  );
};

/**
 * Skeleton/Visual para o quarto card ("Interaja em tempo real").
 * Renderiza o componente interativo `Globe`.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX do SkeletonFour.
 */
export const SkeletonFour = () => {
  return (
    // Container para centralizar e posicionar o globo.
    // Ajustado height para evitar overflow excessivo.
    <div className="h-[400px] md:h-[500px] w-full flex flex-col items-center justify-center relative bg-transparent overflow-hidden">
      {/* Renderiza o componente Globe, aplicando escala responsiva. */}
      <Globe className="absolute transform scale-[0.8] md:scale-[1.1] -bottom-1/4 md:-bottom-1/3" />
    </div>
  );
};


// --- Componente Globo Interativo ---

/**
 * Componente que renderiza um globo 3D interativo usando a biblioteca `cobe`.
 * O globo rotaciona automaticamente e permite interação do usuário (arrastar)
 * para mudar a rotação manualmente usando `framer-motion`.
 *
 * @component
 * @param {{ className?: string }} props - Propriedades do componente.
 * @returns {JSX.Element} O elemento canvas onde o globo é renderizado.
 */
export const Globe = ({ className }: { className?: string }) => {
  // Ref para o elemento canvas onde o globo será renderizado.
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Ref para rastrear o ponto inicial da interação do ponteiro.
  const pointerInteracting = useRef<number | null>(null);
  // Ref para rastrear o movimento acumulado do ponteiro durante a interação.
  const pointerInteractionMovement = useRef(0);
  // Valor de movimento (motion value) do Framer Motion para controlar a rotação adicional baseada na interação.
  const rotationValue = useMotionValue(0);

  // Efeito para inicializar e controlar o globo `cobe`.
  useEffect(() => {
    let phi = 0; // Variável para controlar a rotação automática horizontal (phi).
    let width = 0; // Variável para armazenar a largura do canvas.

    // Função para atualizar a largura do canvas em redimensionamentos.
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth; // Obtém a largura atual do elemento canvas.
      }
    };
    window.addEventListener('resize', onResize); // Adiciona listener de resize.
    onResize(); // Chama uma vez para definir a largura inicial.

    // Sai se o canvas ainda não estiver montado.
    if (!canvasRef.current) return;

    // Cria a instância do globo `cobe` no canvas.
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2, // Qualidade da renderização (bom para telas retina).
      width: width * 2, // Largura interna do canvas (dobro para alta densidade).
      height: width * 2, // Altura interna do canvas (baseada na largura para ser quadrado).
      phi: 0, // Rotação horizontal inicial.
      theta: 0.3, // Rotação vertical inicial (inclinação).
      dark: 1, // Usa esquema de cores escuro (1) ou claro (0).
      diffuse: 3, // Intensidade da luz difusa.
      mapSamples: 16000, // Qualidade da amostragem do mapa.
      mapBrightness: 1.2, // Brilho do mapa base.
      baseColor: [1, 1, 1], // Cor base do globo (branco).
      markerColor: [251 / 255, 100 / 255, 21 / 255], // Cor dos marcadores (laranja).
      glowColor: [1.2, 1.2, 1.2], // Cor do brilho atmosférico.
      markers: [ // Array de marcadores (exemplo: localização aproximada de Assis Chateaubriand, PR)
        { location: [-24.5120468, -53.4054826], size: 0.05 }, // Ajustado localização e tamanho
      ],
      // Função chamada a cada frame da renderização.
      onRender: (state: any) => {
        // Atualiza a rotação automática SE não houver interação do usuário.
        if (!pointerInteracting.current) {
          phi += 0.005; // Incrementa a rotação automática.
        }
        // Aplica a rotação total: automática (phi) + interação do usuário (rotationValue).
        state.phi = phi + rotationValue.get();
        // Atualiza as dimensões internas do canvas caso a largura tenha mudado.
        state.width = width * 2;
        state.height = width * 2;
      }
    });

    // Timeout para aplicar fade-in suave ao canvas após a inicialização.
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1';
      }
    });

    // --- Função de Limpeza do Efeito ---
    // Essencial para liberar recursos quando o componente é desmontado.
    return () => {
      globe.destroy(); // Destroi a instância do globo `cobe`.
      window.removeEventListener('resize', onResize); // Remove o listener de resize.
    };
  }, [rotationValue]); // A dependência `rotationValue` garante que o `useEffect` não recrie o globo desnecessariamente.

  return (
    // Container para o canvas, definindo o tamanho e aspecto.
    <div style={{
      width: '100%', // Ocupa a largura do container pai
      maxWidth: '600px', // Limite máximo de largura
      aspectRatio: '1 / 1', // Força a ser quadrado
      margin: 'auto',
      position: 'relative', // Necessário para o posicionamento absoluto do canvas interno
    }}>
      <canvas
        ref={canvasRef} // Associa a ref ao elemento canvas.
        // --- Manipuladores de Evento para Interação ---
        onPointerDown={(e) => { // Início do clique/toque
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current; // Registra posição inicial
          if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'; // Muda cursor
        }}
        onPointerUp={() => { // Fim do clique/toque
          pointerInteracting.current = null; // Reseta interação
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab'; // Restaura cursor
        }}
        onPointerOut={() => { // Ponteiro sai da área do canvas
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => { // Movimento do mouse com botão pressionado
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current; // Calcula diferença de posição
            pointerInteractionMovement.current = delta; // Atualiza movimento acumulado
            rotationValue.set(delta / 200); // Atualiza o motion value (controla velocidade da rotação)
          }
        }}
        onTouchMove={(e) => { // Movimento de toque (para mobile)
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            rotationValue.set(delta / 100); // Ajuste de sensibilidade para toque
          }
        }}
        // --- Estilos do Canvas ---
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab', // Cursor padrão
          contain: 'layout paint size', // Otimização de performance
          opacity: 0, // Opacidade inicial para fade-in
          transition: 'opacity 1s ease', // Transição suave de opacidade
          position: 'absolute', // Posiciona dentro do container div
          top: 0,
          left: 0,
        }}
        className={className} // Aplica classes customizadas, se houver
      />
    </div>
  );
};