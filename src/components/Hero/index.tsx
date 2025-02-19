import { Button, buttonVariants } from "../ui/button";
import { HeroCards } from "../HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { InfiniteMovingCardsDemo } from "../MovingCards";
import { MoveRight } from "lucide-react";
import { LinkPreview } from "../ui/link-preview";


export const Hero = () => {
  return (
    <section className="container mx-auto grid grid-cols-1 xl:grid-cols-2 place-items-center py-20 md:py-32 gap-10 overflow-hidden">
      <div className="text-center xl:text-start space-y-6">
        <main className="text-4xl md:text-6xl font-bold">
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
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
          Numquam cum voluptatum vel ratione pariatur.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-[80%] md:w-1/3">Comece já {" "} <MoveRight /></Button>

          <LinkPreview
            url="https://github.com/HenriqueSagawa/ifcode"
            className={`w-[80%] md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Repositório do Github
            <GitHubLogoIcon className="ml-2 w-5 h-5" />
          </LinkPreview>
        </div>
      </div>

      {/* Hero cards sections */}

      
      <div className="z-10">
        <div className="hidden xl:block">
          <HeroCards />
        </div>
        <div className="block xl:hidden">
          <InfiniteMovingCardsDemo />
        </div>
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
