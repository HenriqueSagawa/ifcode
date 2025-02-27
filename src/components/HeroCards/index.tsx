"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { LightBulbIcon } from "../Hero/Icons";
import Link from "next/link";
import { motion } from "motion/react";
import { LinkPreview } from "../ui/link-preview";

const CardMotion = motion(Card); // Cria um componente Card animado usando framer-motion.

/**
 * Componente que renderiza um conjunto de cards animados na seção Hero.
 *
 * Este componente exibe cards com informações sobre o IF Code, o Gemini,
 * e outros benefícios da plataforma. Os cards são animados com movimentos
 * sutis para criar um efeito visual atraente.
 *
 * @returns {JSX.Element} O conjunto de cards da seção Hero renderizado.
 */
export const HeroCards = () => {
  return (
    <div className="lg:flex flex-row mt-12 xl:mt-0 flex-wrap gap-8 relative lg:mx-0 w-[550px] h-[350px] 2xl:w-[700px] 2xl:h-[500px]">
      {/* Container principal para os cards. */}
      <CardMotion
        animate={{ y: [10, -10, 10] }} // Define a animação vertical (para cima e para baixo).
        transition={{
          repeat: Infinity, // Repete a animação indefinidamente.
          duration: 4.2, // Define a duração de cada ciclo da animação.
        }}
        className="absolute w-[290px] 2xl:w-[340px] -top-[15px] 2xl:scale-100 scale-[.8] 2xl:left-0 left-[-100px] drop-shadow-xl shadow-black/10 dark:shadow-white/10"
      >
        {/* Card com informações sobre o Instagram do IF Code. */}
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          {/* Header do card. */}
          <Avatar>
            {/* Avatar do Instagram. */}
            <AvatarImage
              alt=""
              src="https://i.imgur.com/UJCtFtt.png"
            />
            <AvatarFallback>IF</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            {/* Informações do Instagram. */}
            <CardTitle className="text-lg">IF Code</CardTitle>
            <CardDescription>
              <LinkPreview url="https://www.instagram.com/ifcode.assis/" className="dark:!text-gray-300 text-gay-600">
                @ifcode.assis
              </LinkPreview>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>Siga nossa página no instagram</CardContent>
        {/* Conteúdo do card. */}
      </CardMotion>

      <CardMotion
        animate={{ y: [15, -15, 15] }} // Define a animação vertical (para cima e para baixo).
        transition={{ repeat: Infinity, duration: 6 }} // Repete a animação indefinidamente.
        className="absolute 2xl:scale-100 right-[30px] 2xl:right-[20px] 2xl:top-4 -top-1 w-64 h-[250px] 2xl:w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10"
      >
        {/* Card com informações sobre o Gemini. */}
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          {/* Header do card. */}
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
          {/* Conteúdo do card. */}
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae, nobis deserunt?
          </p>
        </CardContent>

        <CardFooter>
          {/* Footer do card. */}
          <Button>
            <Link href="https://gemini.google.com/app?hl=pt-BR">Conheça</Link>
          </Button>
        </CardFooter>
      </CardMotion>

      <CardMotion
        animate={{ y: [5, -5, 5] }} // Define a animação vertical (para cima e para baixo).
        transition={{ repeat: Infinity, duration: 4.7 }} // Repete a animação indefinidamente.
        className="absolute 2xl:scale-100 2xl:top-[150px] top-[150px] left-[-50px] 2xl:left-[50px]  w-64 2xl:w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10"
      >
        {/* Card com informações sobre o IF Code. */}
        <CardHeader>
          {/* Header do card. */}
          <CardTitle className="flex item-center justify-between">
            IF Code
          </CardTitle>

          <CardDescription>
            Lorem ipsum dolor sit, amet ipsum consectetur adipisicing elit.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Conteúdo do card. */}
          <Button className="w-full">Encontrar ajuda</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          {/* Footer do card. */}
          <div className="space-y-4">
            {/* Lista de benefícios. */}
            {["Encontre ajuda", "Desenvolva projetos", "Participe de um grupo"].map(
              (benefit: string) => (
                <span
                  key={benefit}
                  className="flex"
                >
                  <Check className="text-green-500" />{" "}
                  {/* Ícone de check. */}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </CardMotion>

      <CardMotion
        animate={{ y: [10, -5, 10] }} // Define a animação vertical (para cima e para baixo).
        transition={{ repeat: Infinity, duration: 5.4 }} // Repete a animação indefinidamente.
        className="absolute 2xl:scale-100 w-[300px] h-[auto] 2xl:w-[350px] right-[5px] 2xl:-right-[10px] 2xl:bottom-[35px] bottom-[-60px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10"
      >
        {/* Card com informações sobre o Instituto Federal. */}
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          {/* Header do card. */}
          <div className="mt-1 invert bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>O Instituto Federal</CardTitle>
            <CardDescription className="text-md mt-2">
              Lorem ipsum dolor sit amet consect adipisicing elit. Consectetur
              natusm.
            </CardDescription>
          </div>
        </CardHeader>
      </CardMotion>
    </div>
  );
};
