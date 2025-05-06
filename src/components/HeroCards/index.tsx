// Indica que este é um Client Component no Next.js App Router.
// Necessário para uso de hooks como os do framer-motion e interações do lado do cliente.
"use client";

// Importações de componentes de UI e utilitários
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"; // Componente para exibir avatares
import { Button } from "@heroui/button"; // Componente de botão da biblioteca HeroUI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"; // Componentes para estruturar cards (provavelmente Shadcn/ui)
import { Check } from "lucide-react"; // Ícone de "check" da biblioteca Lucide
import { LightBulbIcon } from "../Hero/Icons"; // Ícone customizado (não utilizado neste snippet, mas importado)
import Link from "next/link"; // Componente do Next.js para navegação entre páginas
import { motion } from "motion/react"; // Biblioteca Framer Motion para animações
import { LinkPreview } from "../ui/link-preview"; // Componente customizado para preview de links
import Image from "next/image"; // Componente do Next.js para otimização de imagens

/**
 * @file HeroCards.tsx - Componente da Seção Hero com Cards Animados.
 * @module components/HeroCards
 *
 * @description
 * O componente `HeroCards` é responsável por renderizar um conjunto de cards
 * interativos e animados que compõem a seção principal (Hero) da página.
 * Ele utiliza `framer-motion` para aplicar animações de flutuação aos cards,
 * tornando a interface mais dinâmica e engajadora.
 *
 * Cada card apresenta informações distintas:
 * 1. Card do "IF Code" com link para o Instagram.
 * 2. Card sobre "Gemini" (IA do Google) com um botão para "Conhecer".
 * 3. Card destacando os benefícios do "IF Code" com um botão para "Encontrar ajuda".
 * 4. Card informativo sobre o "IFPR".
 *
 * O layout é responsivo, ajustando o posicionamento e tamanho dos cards
 * em diferentes tamanhos de tela (especialmente `lg` e `2xl`).
 *
 * @example
 * // Em uma página Next.js:
 * import { HeroCards } from '@/components/your-path/HeroCards';
 *
 * export default function HomePage() {
 *   return (
 *     <section>
 *       <HeroCards />
 *     </section>
 *   );
 * }
 */

// Cria um componente Card com capacidade de animação usando framer-motion.
// Isso permite que o componente <Card> receba props de animação como `animate` e `transition`.
const CardMotion = motion(Card);

/**
 * Componente `HeroCards`
 * Renderiza uma coleção de cards animados para a seção Hero.
 * Não recebe props.
 *
 * @returns {JSX.Element} Um container div com quatro componentes `CardMotion` animados.
 */
export const HeroCards = () => {
  return (
    // Container principal para os cards.
    // Utiliza Flexbox para layout em telas maiores (lg).
    // O posicionamento relativo é crucial para que os cards internos com posicionamento absoluto
    // se orientem corretamente em relação a este container.
    // As classes w-[...] h-[...] definem dimensões responsivas.
    <div className="lg:flex flex-row mt-12 xl:mt-0 flex-wrap gap-8 relative lg:mx-0 w-[520px] h-[320px] 2xl:w-[700px] 2xl:h-[500px]">
      {/* CARD 1: IF Code Instagram */}
      <CardMotion
        // Define a animação: movimento vertical (eixo Y) entre 10px e -10px.
        animate={{ y: [10, -10, 10] }}
        // Define as propriedades da transição da animação.
        transition={{
          repeat: Infinity, // A animação se repetirá indefinidamente.
          duration: 4.2,    // Cada ciclo da animação dura 4.2 segundos.
        }}
        // Classes de estilização Tailwind CSS:
        // - `absolute`: Posicionamento absoluto em relação ao pai (o div container).
        // - `w-[250px]`, `2xl:w-[310px]`: Largura responsiva.
        // - `-top-[15px]`, `scale-[.8]`, `left-[-100px]`: Posicionamento e escala para diferentes breakpoints.
        // - `drop-shadow-xl`, `shadow-black/10`, `dark:shadow-white/10`: Efeitos de sombra.
        className="absolute w-[250px] 2xl:w-[310px] -top-[15px] 2xl:scale-100 scale-[.8] 2xl:left-0 left-[-100px] drop-shadow-xl shadow-black/10 dark:shadow-white/10"
      >
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage alt="Logo IF Code" src="/img/logo ifcode.png" />
            <AvatarFallback>IF</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">IF Code</CardTitle>
            <CardDescription>
              {/* Componente LinkPreview para exibir um preview do link do Instagram */}
              <LinkPreview
                url="https://www.instagram.com/ifcode.assis/"
                className="dark:!text-gray-300 text-gay-600" // Note: "text-gay-600" parece um typo, deveria ser "text-gray-600"?
              >
                @ifcode.assis
              </LinkPreview>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>Siga nossa página no instagram</CardContent>
      </CardMotion>

      {/* CARD 2: Gemini AI */}
      <CardMotion
        animate={{ y: [15, -15, 15] }}
        transition={{ repeat: Infinity, duration: 6 }}
        // Classes de estilização para posicionamento, tamanho e aparência.
        className="absolute 2xl:scale-100 right-[30px] 2xl:right-[20px] 2xl:top-4 -top-1 w-60 h-[220px] 2xl:w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10"
      >
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          {/* Imagem do logo Gemini posicionada sobre o card */}
          <img
            src="https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-PNG-Photo.png"
            alt="Gemini"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">Gemini</CardTitle>
          <CardDescription className="font-normal text-primary">
            Inteligência Artifical
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>O Gemini é um modelo de linguagem multimodal avançado do Google.</p>
        </CardContent>

        <CardFooter>
          {/* Link para a página de chat, estilizado como um botão */}
          <Link href="/chat" legacyBehavior passHref>
            <Button className="dark:bg-zinc-50 bg-zinc-900 text-zinc-50 dark:text-zinc-900">
              Conheça
            </Button>
          </Link>
        </CardFooter>
      </CardMotion>

      {/* CARD 3: IF Code Benefícios */}
      <CardMotion
        animate={{ y: [5, -5, 5] }}
        transition={{ repeat: Infinity, duration: 4.7 }}
        className="absolute 2xl:scale-100 2xl:top-[150px] top-[170px] left-[-50px] 2xl:left-[50px]  w-64 2xl:w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10"
      >
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            IF Code
          </CardTitle>
          <CardDescription>
            IF Code soluciona suas dúvidas de forma rápida
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Link para a página de posts, estilizado como um botão */}
          <Link href="/posts" legacyBehavior passHref>
            <Button className="w-full dark:bg-zinc-50 bg-zinc-900 text-zinc-50 dark:text-zinc-900">
              Encontrar ajuda
            </Button>
          </Link>
        </CardContent>

        {/* Linha divisória */}
        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {/* Mapeia uma lista de strings para renderizar os benefícios com ícones de check */}
            {[
              "Encontre ajuda",
              "Desenvolva projetos",
              "Participe de um grupo",
            ].map((benefit: string) => (
              <span key={benefit} className="flex">
                <Check className="text-green-500" />{" "}
                <h3 className="ml-2">{benefit}</h3>
              </span>
            ))}
          </div>
        </CardFooter>
      </CardMotion>

      {/* CARD 4: IFPR */}
      <CardMotion
        animate={{ y: [10, -5, 10] }}
        transition={{ repeat: Infinity, duration: 5.4 }}
        className="absolute 2xl:scale-100 w-[270px] h-[auto] 2xl:w-[350px] right-[5px] 2xl:-right-[10px] 2xl:bottom-[10px] bottom-[-210px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10"
      >
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 p-1 rounded-2xl ">
            {/* Componente Image do Next.js para otimização da imagem do logo IFPR */}
            <Image
              src="/img/logo ifpr.png"
              alt="Logo do IFPR"
              width={100}
              height={100}
            />
          </div>
          <div>
            <CardTitle>O IFPR</CardTitle>
            <CardDescription className="text-sm mt-2">
              O Instituto Federal de Educação, Ciência e Tecnologia do Paraná
              (IFPR) é uma instituição pública federal que oferece educação
              profissional e tecnológica gratuita em diversas modalidades e
              níveis de ensino.
            </CardDescription>
          </div>
        </CardHeader>
      </CardMotion>
    </div>
  );
};