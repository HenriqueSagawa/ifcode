import { Button } from "@heroui/button"; // Componente de botão da biblioteca HeroUI
import { HeroCards } from "../HeroCards"; // Componente personalizado para exibir cards estáticos (provavelmente em telas maiores)
import { GitHubLogoIcon } from "@radix-ui/react-icons"; // Ícone do GitHub da biblioteca Radix UI
import { InfiniteMovingCardsDemo } from "../MovingCards"; // Componente personalizado para exibir cards em movimento (provavelmente em telas menores)
import { MoveRight } from "lucide-react"; // Ícone de seta para a direita da biblioteca Lucide
import { LinkPreview } from "../ui/link-preview"; // Componente personalizado para pré-visualização de links
import Link from "next/link"; // Componente Link do Next.js para navegação client-side

/**
 * @component Hero
 * @description Renderiza a seção principal (Hero section) da página inicial.
 * Apresenta o título principal, uma descrição do propósito do site (IF Code),
 * e botões de chamada para ação (CTA) para começar a explorar ou visitar o repositório GitHub.
 * Inclui elementos visuais (cards) que se adaptam responsivamente ao tamanho da tela.
 *
 * @returns {JSX.Element} O componente da seção Hero renderizado.
 */
export const Hero = () => {
  return (
    // Seção principal com container, centralização, padding e espaçamento
    <section className="container mx-auto grid grid-cols-1 xl:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      {/* Coluna Esquerda: Conteúdo textual e CTAs */}
      <div className="text-center xl:text-start space-y-6">
        {/* Título principal com destaque em gradiente */}
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

        {/* Parágrafo descritivo */}
        <p className="text-xl text-muted-foreground w-[80%] md:w-10/12 mx-auto lg:mx-auto xl:mx-0">
          Tire dúvidas, compartilhe conhecimento e encontre suporte para seus desafios em informática, tudo de forma rápida e acessível!
        </p>

        {/* Container para os botões de ação */}
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          {/* Botão 1: Leva para a página de posts */}
          <Link href="/posts" passHref> {/* passHref é importante para acessibilidade e SEO com alguns componentes de UI */}
            <Button className="w-[80%] md:w-1/3 !bg-zinc-900 dark:!bg-zinc-50 text-zinc-50 dark:text-zinc-900">
              Comece já <MoveRight className="ml-1 h-5 w-5" /> {/* Adicionado espaçamento e tamanho ao ícone */}
            </Button>
          </Link>

          {/* Botão 2: Link para o repositório GitHub com preview */}
          {/* Usando LinkPreview para envolver o conteúdo do botão */}
          <Button asChild color="default" variant="ghost" className="w-[80%] md:w-1/3">
             {/* asChild permite que o Button renderize o LinkPreview como seu filho direto, passando as props */}
            <LinkPreview
              url="https://github.com/IFcode-Assis"
              className="flex items-center justify-center w-full" // Garante alinhamento e largura dentro do botão
            >
              Repositório do Github
              <GitHubLogoIcon className="ml-2 w-5 h-5" />
            </LinkPreview>
          </Button>
        </div>
      </div>

      {/* Coluna Direita: Elementos visuais (Cards) */}
      <div className="z-10">
        {/* Renderização condicional de cards baseada no tamanho da tela */}
        {/* Em telas extra-largas (xl) e maiores, mostra os HeroCards estáticos */}
        <div className="hidden xl:block">
          <HeroCards />
        </div>
        {/* Em telas menores que extra-largas, mostra os InfiniteMovingCardsDemo */}
        <div className="block xl:hidden">
          <InfiniteMovingCardsDemo />
        </div>
      </div>

      {/* Elemento para possível efeito visual de sombra ou fundo */}
      <div className="shadow"></div>
    </section>
  );
};