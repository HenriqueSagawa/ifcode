import { Button, buttonVariants } from "../ui/button";
import { HeroCards } from "../HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { InfiniteMovingCardsDemo } from "../MovingCards";
import { MoveRight } from "lucide-react";
import { LinkPreview } from "../ui/link-preview";

/**
 * Componente que renderiza a seção Hero da página inicial.
 *
 * Esta seção apresenta o título principal, uma breve descrição e botões
 * para iniciar e acessar o repositório do GitHub. Também inclui um efeito visual
 * com cards em movimento.
 *
 * @returns {JSX.Element} A seção Hero renderizada.
 */
export const Hero = () => {
  return (
    <section className="container mx-auto grid grid-cols-1 xl:grid-cols-2 place-items-center py-20 md:py-32 gap-10 overflow-hidden">
      {/* Container principal da seção Hero. */}
      <div className="text-center xl:text-start space-y-6">
        {/* Container para o conteúdo textual (título, descrição e botões). */}
        <main className="text-4xl md:text-6xl font-bold">
          {/* Título principal. */}
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
          {/* Descrição da seção Hero. */}
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Numquam cum voluptatum vel ratione pariatur.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          {/* Container para os botões. */}
          <Button className="w-[80%] md:w-1/3">
            {/* Botão principal para iniciar. */}
            Comece já <MoveRight />
          </Button>

          <LinkPreview
            url="https://github.com/HenriqueSagawa/ifcode"
            className={`w-[80%] md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            {/* Botão para acessar o repositório do GitHub. */}
            Repositório do Github
            <GitHubLogoIcon className="ml-2 w-5 h-5" />
          </LinkPreview>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        {/* Container para os cards em movimento. */}
        <div className="hidden xl:block">
          {/* Renderiza o componente HeroCards em telas maiores. */}
          <HeroCards />
        </div>
        <div className="block xl:hidden">
          {/* Renderiza o componente InfiniteMovingCardsDemo em telas menores. */}
          <InfiniteMovingCardsDemo />
        </div>
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
