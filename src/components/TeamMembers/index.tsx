// Indica que este é um Client Component no Next.js App Router.
// Necessário para os componentes de UI com efeitos interativos como o 3D Card.
"use client";

// Importações de React, Next.js e componentes de UI.
// `motion` não está sendo usado diretamente aqui, mas pode ser uma dependência
// interna do componente de 3D Card. Se não for, pode ser removido.
// import { motion } from "framer-motion"; // Verificar se é realmente necessário aqui
import Image from "next/image"; // Para otimização de imagens
// Ícones (FaGithub, FaLinkedin não estão sendo usados no código fornecido,
// mas poderiam ser adicionados para links de perfil).
// import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card"; // Componentes para o efeito de card 3D.

/**
 * @interface TeamMember
 * @description Define a estrutura de um objeto representando um membro da equipe.
 */
interface TeamMember {
  /** @prop {string} name - O nome completo do membro da equipe. */
  name: string;
  /** @prop {string} role - A função ou o papel do membro na equipe/projeto. */
  role: string;
  /** @prop {string} image - A URL ou o caminho para a imagem de perfil do membro.
   *                       Pode ser uma URL externa ou um caminho para um arquivo local em `/public`.
   *                       Se vazio, uma imagem placeholder ou nenhuma imagem será mostrada.
   */
  image: string;
  /** @prop {string} [github] - A URL para o perfil do GitHub do membro (opcional).
   *                         Atualmente não renderizado no card, mas presente nos dados.
   */
  github?: string;
  /** @prop {string} description - Uma breve descrição sobre o membro, suas especialidades ou contribuições. */
  description: string;
}

/**
 * @constant teamMembersData
 * @description Um array de objetos `TeamMember` contendo as informações dos membros da equipe
 *              a serem exibidos nos cards.
 * @todo Para as imagens, garantir que os caminhos locais (ex: "/img/team/member3.jpg")
 *       estejam corretos e que os arquivos existam na pasta `public`.
 *       Para membros sem imagem (ex: Vagner), considerar adicionar uma imagem placeholder
 *       ou ajustar o layout para lidar graciosamente com a ausência de imagem.
 */
const teamMembersData: TeamMember[] = [
  {
    name: "Henrique Tutomu Sagawa",
    role: "Desenvolvedor Frontend e Backend",
    image: "https://media.gettyimages.com/id/962792890/pt/foto/kiev-ukraine-cristiano-ronaldo-of-real-madrid-lifts-the-uefa-champions-league-trophy-following.jpg?s=2048x2048&w=gi&k=20&c=bHK_tF9_cMrXcIF8i_i9iDvhBKRxyFi0aGc13yywW7k=",
    github: "https://github.com/Henrique Sagawa", // Nota: Link do GitHub parece ter um espaço, verificar.
    description: "Especialista em React e Next.js, focado em criar interfaces dinâmicas e responsivas."
  },
  {
    name: "João Victor Nogueira Calassara",
    role: "Documentador de Código e Desenvolvedor Backend",
    image: "https://media.gettyimages.com/id/2155285978/pt/foto/athens-greece-rodinei-of-olympiakos-poses-for-a-portrait-with-the-uefa-europa-conference.jpg?s=2048x2048&w=gi&k=20&c=GHouo3Aeqqlp5G9AgYRKwFaa43W2s6DvY51PWGW1lMc=",
    github: "", // Pode adicionar link se disponível
    description: "Responsável pela clareza e manutenção da documentação do projeto, além de contribuir no backend."
  },
  {
    name: "Michelli Cristina Galli",
    role: "Orientadora do Projeto",
    image: "/img/michelle.png", // Exemplo: /img/team/michelle.png
    github: "",
    description: "Professora Doutora, especialista em Estudos da Linguagem (UEL), guiando a pesquisa e desenvolvimento."
  },
  {
    name: "Vagner Simões Santos",
    role: "Coorientador do Projeto",
    image: "/img/vagner.png", // Se não houver imagem, o componente Image tentará carregar uma string vazia.
                      // Considerar uma imagem placeholder ou lógica condicional.
    github: "",
    description: "Professor Mestre em Propriedade Intelectual e Transferência de Tecnologia para Inovação."
  }
];

/**
 * @file TeamMembers.tsx - Componente para Exibir Membros da Equipe em Cards 3D.
 * @module components/TeamMembers (ou o caminho apropriado)
 *
 * @description
 * O componente `TeamMembers` renderiza uma seção que lista os membros de uma equipe.
 * Cada membro é apresentado em um "card 3D" interativo que reage ao movimento do mouse,
 * proporcionado pelos componentes `CardContainer`, `CardBody`, e `CardItem` (provavelmente da Aceternity UI).
 *
 * As informações exibidas para cada membro incluem nome, função, imagem de perfil e uma breve descrição.
 * Os dados dos membros são fornecidos através de um array estático `teamMembersData`.
 *
 * A seção é responsiva, ajustando o layout dos cards conforme o tamanho da tela.
 *
 * Este componente não recebe props.
 *
 * @returns {JSX.Element} Um `div` contendo uma lista de componentes `CardContainer`, cada um representando um membro da equipe.
 *
 * @example
 * // Em uma página "Sobre Nós" ou "Equipe", após a seção Hero da equipe:
 * import { TeamMembers } from '@/components/TeamMembers';
 *
 * export default function TeamPage() {
 *   return (
 *     <>
 *       {/* ... TeamHero e outros conteúdos ... *\/}
 *       <div className="py-12">
 *         <h2 className="text-3xl font-bold text-center mb-8">Conheça Nossa Equipe</h2>
 *         <TeamMembers />
 *       </div>
 *       {/* ... restante do conteúdo ... *\/}
 *     </>
 *   );
 * }
 */
export function TeamMembers() {
  return (
    // Container principal para os cards da equipe.
    // Utiliza flexbox para layout, permitindo que os cards quebrem para a próxima linha (`flex-wrap`).
    // Centraliza os cards horizontalmente (`justify-center`).
    <div className="flex gap-6 md:gap-8 max-w-full w-full dark:bg-transparent flex-wrap justify-center items-stretch py-12 px-4"> {/* Adicionado padding e items-stretch */}
      {
        // Mapeia o array `teamMembersData` para renderizar um CardContainer para cada membro.
        teamMembersData.map((member, index) => (
          <CardContainer key={member.name || index} className="inter-var w-full sm:w-auto"> {/* Chave única e largura */}
            {/* CardBody define a aparência e o comportamento do card 3D. */}
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full max-w-xs sm:max-w-sm h-auto sm:h-[28rem] rounded-xl p-6 border flex flex-col justify-between"> {/* Ajustes de tamanho e layout flex */}
              <div> {/* Container para o conteúdo superior do card */}
                {/* Nome do membro - CardItem com efeito de translação no eixo Z. */}
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-700 dark:text-white"
                >
                  {member.name}
                </CardItem>
                {/* Função do membro - CardItem com efeito de translação e estilização. */}
                <CardItem
                  as="p" // Renderiza como um parágrafo.
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-1 dark:text-neutral-300"
                >
                  {member.role}
                </CardItem>
                {/* Imagem do membro - CardItem com efeito de translação. */}
                <CardItem translateZ="80" className="w-full mt-4"> {/* Ajustado translateZ para imagem */}
                  {/* Componente Image do Next.js para otimização da imagem.
                      `object-cover` garante que a imagem cubra a área designada sem distorção. */}
                  <div className="aspect-square w-full overflow-hidden rounded-xl group-hover/card:shadow-xl bg-gray-200 dark:bg-gray-700"> {/* Placeholder background */}
                    {member.image ? (
                      <Image
                        src={member.image}
                        height={400} // Altura e largura base para aspect ratio e otimização
                        width={400}
                        className="h-full w-full object-cover"
                        alt={`Foto de ${member.name}`}
                        // Adicionar `onError` para lidar com imagens quebradas, se necessário.
                        // onError={(e) => (e.currentTarget.src = '/path/to/placeholder.jpg')}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <span>Sem Imagem</span> {/* Placeholder para quando não há imagem */}
                      </div>
                    )}
                  </div>
                </CardItem>
              </div>

              <div> {/* Container para a descrição, para melhor controle de espaçamento inferior */}
                {/* Descrição do membro - CardItem com efeito de translação. */}
                <CardItem
                  as="p"
                  translateZ="40" // Ajustado translateZ para descrição
                  className="text-neutral-600 dark:text-neutral-400 text-xs max-w-sm mt-4"
                >
                  {member.description}
                </CardItem>
                {/*
                  // Seção para ícones de redes sociais (exemplo, não implementado no código original)
                  // <div className="flex items-center mt-6">
                  //   {member.github && (
                  //     <a href={member.github} target="_blank" rel="noopener noreferrer" className="mr-3 text-neutral-500 hover:text-neutral-700 dark:hover:text-white">
                  //       <FaGithub size={20} />
                  //     </a>
                  //   )}
                  //   {/* Adicionar LinkedIn ou outras redes aqui *\/}
                  // </div>
                */}
              </div>
            </CardBody>
          </CardContainer>
        ))
      }
    </div>
  );
}