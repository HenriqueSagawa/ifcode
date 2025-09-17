'use client'

import { Button } from "@/components/ui/button";
import { HeroCards } from "../HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { MoveRight } from "lucide-react";
import { LinkPreview } from "../ui/link-preview";
import Link from "next/link";


export const Hero = () => {
  return (
    <section className="relative container px-2 mx-auto grid grid-cols-1 xl:grid-cols-2 place-items-center py-20 md:py-32 gap-10 overflow-x-clip">

      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-green-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center xl:text-start space-y-6">
        <main className="relative text-4xl md:text-6xl font-bold">

          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#80C342]  to-[#118B44] text-transparent bg-clip-text">
              IF Code
            </span>{" "}
            Solucione suas
          </h1>{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#ffba08] via-[#faa307] to-[#f48c06] text-transparent bg-clip-text">
              Dúvidas
            </span>{" "}
            de forma rápida
          </h2>
        </main>

        <p className="text-xl text-muted-foreground w-[80%] md:w-10/12 mx-auto lg:mx-auto xl:mx-0">
          Tire dúvidas, compartilhe conhecimento e encontre suporte para seus desafios em informática, tudo de forma rápida e acessível!
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link href="/posts">
            <Button className="w-[80%] md:w-1/3 !bg-zinc-900 dark:!bg-zinc-50 text-zinc-50 dark:text-zinc-900">Comece já {" "} <MoveRight /></Button>
          </Link>

          <Button color="default" variant="ghost" className="w-[80%] md:w-1/3 ">
            <LinkPreview
              url="https://github.com/IFcode-Assis"
              className="flex items-center"
            >
              Repositório do Github
              <GitHubLogoIcon className="ml-2 w-5 h-5" />
            </LinkPreview>
          </Button>

        </div>
      </div>

      {/* Hero cards sections */}


      <div className="z-10">
        <div className="hidden xl:block">
          <HeroCards />
        </div>
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
