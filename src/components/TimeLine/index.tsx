import Image from "next/image";
import React from "react";
// Importa o componente customizado de Timeline.
// A documentação deste componente `Timeline` em si seria separada,
// focando em suas props (como `data`) e funcionamento interno.
import { Timeline, TimelineItemData } from "../ui/timeline"; // Assumindo que TimelineItemData pode ser exportado de lá

/**
 * @interface TimelineEventContent
 * @description Define a estrutura do conteúdo a ser renderizado dentro de um item da timeline.
 *              Neste caso, o conteúdo é um JSX.Element, permitindo flexibilidade total.
 */
// interface TimelineEventContent {
//   // Se o componente Timeline esperasse uma estrutura específica para `content`,
//   // poderíamos definir aqui. Como é JSX.Element, a flexibilidade é maior.
//   // Exemplo:
//   // description: string;
//   // images: { src: string; alt: string }[];
// }

// Tipo para os dados de cada item da timeline, conforme esperado pelo componente `Timeline`.
// Se `TimelineItemData` já é exportado de `../ui/timeline`, podemos usá-lo diretamente.
// Caso contrário, definimos aqui com base no uso.
type CustomTimelineItemData = {
  /** @prop {string | number} title - O título do evento na linha do tempo (ex: ano, nome do marco). */
  title: string | number;
  /** @prop {JSX.Element} content - O conteúdo JSX a ser renderizado para este evento da timeline. */
  content: JSX.Element;
  // Outras props que o componente `Timeline` possa esperar para cada item,
  // como `icon`, `color`, etc.
};

/**
 * @constant timelineEventsData
 * @description Um array de objetos `CustomTimelineItemData` (ou `TimelineItemData` se importado)
 *              contendo os dados para cada marco na linha do tempo do projeto IF Code.
 *              Cada item inclui um título (ano) e um conteúdo JSX com descrição e imagens.
 * @todo Para o ano de 2025 e outros futuros, garantir que os caminhos das imagens (`src`)
 *       sejam preenchidos ou que haja uma lógica para exibir placeholders se as imagens
 *       ainda não estiverem disponíveis. Adicionar `alt` text descritivo para todas as imagens
 *       para melhor acessibilidade.
 */
const timelineEventsData: CustomTimelineItemData[] = [
  {
    title: "2023",
    content: (
      // Conteúdo JSX para o evento de 2023
      <div className="space-y-4"> {/* Adicionado space-y para espaçamento entre parágrafo e grid */}
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base font-normal"> {/* Cor e tamanho de texto ajustados */}
          Em 2023, o projeto IF Code teve seu início a partir de uma ideia colaborativa, reunindo os membros fundadores — Henrique Tutomu Sagawa, João Victor Nogueira Calassara, Gustavo Gomes Preti, Christopher Rodrigues Gouveia — sob a orientação da professora Michelli Cristina Galli. O foco inicial foi a concepção e o planejamento da plataforma.
        </p>
        {/* Grid de imagens para o evento de 2023 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4"> {/* Ajuste de gap */}
          <Image
            src="/img/ifcode foto 2023.jpg"
            alt="Primeiro encontro presencial da equipe IF Code em 2023"
            width={500} // Largura e altura base para aspect ratio e otimização
            height={500}
            className="rounded-lg object-cover aspect-video sm:aspect-square w-full shadow-lg dark:shadow-black/20" // `aspect-video` ou `aspect-square` para consistência
          />
          <Image
            src="/img/equipeifcode.jpg"
            alt="Equipe IF Code reunida para planejamento do projeto"
            width={500}
            height={500}
            className="rounded-lg object-cover aspect-video sm:aspect-square w-full shadow-lg dark:shadow-black/20"
          />
          <Image
            src="/img/ifcodefoto2.jpg"
            alt="Sessão de brainstorming da equipe IF Code"
            width={500}
            height={500}
            className="rounded-lg object-cover aspect-video sm:aspect-square w-full shadow-lg dark:shadow-black/20"
          />
          <Image
            src="/img/fotoifcodecapa.jpg"
            alt="Protótipo inicial ou material de divulgação do IF Code"
            width={500}
            height={500}
            className="rounded-lg object-cover aspect-video sm:aspect-square w-full shadow-lg dark:shadow-black/20"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2024",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base font-normal">
          Em 2024, o projeto IF Code ganhou novo impulso com a chegada do professor Vagner Simões Santos como coorientador. Continuamos com encontros presenciais para desenvolvimento e aprimoramento.
        </p>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base font-normal">
          Ao longo do ano, participamos de eventos acadêmicos de grande relevância, como o V SCIENTIF, o X FEPIAC e o IX SE²P²IN, onde apresentamos nossos avanços. O esforço foi recompensado com importantes premiações: 1º lugar na X FEPIAC e 1º lugar geral combinado da X FEPIAC, XII IFTECH e III IFAGROTECH, consolidando o IF Code.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
          <Image
            src="/img/premiacaofepiac.jpg"
            alt="Equipe IF Code recebendo premiação na X FEPIAC 2024" // Alt text descritivo
            width={500}
            height={500}
            className="rounded-lg object-cover object-center sm:object-[25%_40%] aspect-video sm:aspect-square w-full shadow-lg dark:shadow-black/20" // `object-center` como fallback
          />
          <Image
            src="/img/fotofepiac.jpg"
            alt="Apresentação do projeto IF Code na X FEPIAC"
            width={500}
            height={500}
            className="rounded-lg object-cover aspect-video sm:aspect-square w-full shadow-lg dark:shadow-black/20"
          />
          <Image
            src="/img/fotoscientif.jpg"
            alt="Participação do IF Code no V SCIENTIF"
            width={500}
            height={500}
            className="rounded-lg object-cover aspect-video sm:aspect-square w-full shadow-lg dark:shadow-black/20"
          />
          <Image
            src="/img/fotosepin.jpg"
            alt="IF Code no IX SE²P²IN"
            width={500}
            height={500}
            className="rounded-lg object-cover aspect-video sm:aspect-square w-full shadow-lg dark:shadow-black/20"
          />
        </div>
      </div>
    ),
  },
  {
    title: "2025 (Projeções)", // Título mais claro
    content: (
      <div className="space-y-4">
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base font-normal">
          Para 2025, planejamos continuar os encontros presenciais, participar de mais eventos e desenvolver novas iniciativas para o IF Code. Este ano também marcará a conclusão do projeto como nosso trabalho de conclusão de curso, consolidando todo o aprendizado e as experiências adquiridas.
        </p>
        {/* Placeholder para imagens de 2025 - idealmente, adicionar imagens ou um design para "em breve" */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="rounded-lg bg-gray-200 dark:bg-gray-700 aspect-video sm:aspect-square w-full shadow-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-xs">Imagem {index + 1} (2025)</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

/**
 * @file TimelineComponent.tsx - Componente para Exibir a Linha do Tempo do Projeto IF Code.
 * @module components/TimelineComponent (ou o caminho apropriado)
 *
 * @description
 * O `TimelineComponent` renderiza uma linha do tempo vertical que narra a história e
 * os marcos importantes do projeto IF Code. Ele utiliza um componente de UI customizado
 * `Timeline` (de `../ui/timeline`) para a estrutura visual da linha do tempo.
 *
 * Cada item na linha do tempo é definido por um título (geralmente o ano) e um conteúdo
 * JSX, que pode incluir texto descritivo e um grid de imagens relevantes para aquele período.
 * Os dados da linha do tempo são fornecidos através de um array estático `timelineEventsData`.
 *
 * O componente é projetado para ser responsivo, adaptando o tamanho do texto e das imagens
 * para diferentes tamanhos de tela.
 *
 * Este componente não recebe props diretamente, mas passa os dados formatados para o
 * componente filho `Timeline`.
 *
 * @returns {JSX.Element} Um `div` contendo o componente `Timeline` populado com os dados do projeto.
 *
 * @example
 * // Em uma página "Sobre Nós" ou na página inicial para contar a história do projeto:
 * import { TimelineComponent } from '@/components/TimelineComponent';
 *
 * export default function AboutPage() {
 *   return (
 *     <section className="py-12">
 *       <h2 className="text-3xl font-bold text-center mb-10">Nossa Jornada</h2>
 *       <div className="max-w-3xl mx-auto px-4">
 *         <TimelineComponent />
 *       </div>
 *     </section>
 *   );
 * }
 */
export function TimelineComponent() {
  return (
    // Container principal para o componente Timeline.
    // `w-full` garante que ele ocupe a largura disponível do seu container pai.
    <div className="w-full">
      {/* Renderiza o componente Timeline, passando os dados dos eventos.
          O componente `Timeline` (../ui/timeline) é responsável pela lógica
          de renderização da linha do tempo em si. */}
      <Timeline data={timelineEventsData} />
    </div>
  );
}