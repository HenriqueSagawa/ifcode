"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@heroui/button";
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


const CardMotion = motion(Card);

export const HeroCards = () => {
  return (
    <div className="lg:flex flex-row mt-12 xl:mt-0 flex-wrap gap-8 relative lg:mx-0 w-[520px] h-[320px] 2xl:w-[700px] 2xl:h-[500px]">
      <CardMotion animate={{ y: [10, -10, 10] }} transition={{
        repeat: Infinity, duration: 4.2
      }} className="absolute w-[250px] 2xl:w-[310px] -top-[15px] 2xl:scale-100 scale-[.8] 2xl:left-0 left-[-100px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt=""
              src="/img/logo ifcode.png"
            />
            <AvatarFallback>IF</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">IF Code</CardTitle>
            <CardDescription>
              <LinkPreview url="https://www.instagram.com/ifcode.assis/" className="dark:!text-gray-300 text-gay-600">
                @ifcode.assis
              </LinkPreview>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>Siga nossa página no instagram</CardContent>
      </CardMotion>

      <CardMotion animate={{ y: [15, -15, 15] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute 2xl:scale-100 right-[30px] 2xl:right-[20px] 2xl:top-4 -top-1 w-60 h-[220px] 2xl:w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
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
          <p>
            O Gemini é um modelo de linguagem multimodal avançado do Google.
          </p>
        </CardContent>

        <CardFooter>
          <Link href="https://gemini.google.com/app?hl=pt-BR">
            <Button className="dark:bg-zinc-50 bg-zinc-900 text-zinc-50 dark:text-zinc-900">
              Conheça
            </Button>
          </Link>
        </CardFooter>
      </CardMotion>

      <CardMotion animate={{ y: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 4.7 }} className="absolute 2xl:scale-100 2xl:top-[150px] top-[170px] left-[-50px] 2xl:left-[50px]  w-64 2xl:w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            IF Code
          </CardTitle>

          <CardDescription>
            IF Code soluciona suas dúvidas de forma rápida
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link href="/posts">
            <Button className="w-full dark:bg-zinc-50 bg-zinc-900 text-zinc-50 dark:text-zinc-900">Encontrar ajuda</Button>

          </Link>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["Encontre ajuda", "Desenvolva projetos", "Participe de um grupo"].map(
              (benefit: string) => (
                <span
                  key={benefit}
                  className="flex"
                >
                  <Check className="text-green-500" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </CardMotion>

      <CardMotion animate={{ y: [10, -5, 10] }} transition={{ repeat: Infinity, duration: 5.4 }} className="absolute 2xl:scale-100 w-[270px] h-[auto] 2xl:w-[350px] right-[5px] 2xl:-right-[10px] 2xl:bottom-[10px] bottom-[-210px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 invert bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>O IFPR</CardTitle>
            <CardDescription className="text-sm mt-2">
              O Instituto Federal de Educação, Ciência e Tecnologia do Paraná (IFPR) é uma instituição pública federal que oferece educação profissional e tecnológica gratuita em diversas modalidades e níveis de ensino.
            </CardDescription>
          </div>
        </CardHeader>
      </CardMotion>
    </div>
  );
};
