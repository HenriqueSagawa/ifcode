import { Button } from "@heroui/button";
import { HeroCards } from "../HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { InfiniteMovingCardsDemo } from "../MovingCards";
import { MoveRight } from "lucide-react";
import { LinkPreview } from "../ui/link-preview";
import Link from "next/link";


export const Hero = () => {
  return (
    <section className="container mx-auto grid grid-cols-1 xl:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
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
        <div className="block xl:hidden">
          <InfiniteMovingCardsDemo />
        </div>
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
