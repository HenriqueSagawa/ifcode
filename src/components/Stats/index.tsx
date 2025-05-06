import React from "react"; // Import implícito, mas bom para clareza se necessário.

/**
 * @interface StatItem
 * @description Define a estrutura de um item de estatística a ser exibido.
 */
interface StatItem {
  /**
   * @prop {string} data - O valor numérico da estatística (atualmente como string, poderia ser number).
   */
  data: string;
  /**
   * @prop {string} desc - A descrição ou o rótulo da estatística.
   */
  desc: string;
}

/**
 * @constant statsData
 * @description Um array de objetos `StatItem` contendo os dados das estatísticas
 *              a serem exibidos na seção.
 * @todo Atualmente, os valores (`data`) estão fixos como "0".
 *       Considerar tornar esses dados dinâmicos, buscando de uma API ou estado global,
 *       para refletir os números reais da plataforma.
 */
const statsData: StatItem[] = [
  {
    data: "0", // Exemplo: Poderia ser substituído por um valor dinâmico.
    desc: "Dúvidas respondidas"
  },
  {
    data: "0",
    desc: "Estudantes alcançados"
  },
  {
    data: "0",
    desc: "Mentores disponíveis"
  },
  {
    data: "0",
    desc: "Perguntas publicadas"
  },
];

/**
 * @file Stats.tsx - Componente da Seção de Estatísticas da Plataforma.
 * @module components/Stats (ou o caminho apropriado)
 *
 * @description
 * O componente `Stats` renderiza uma seção visualmente atraente para destacar
 * números e conquistas importantes da plataforma "IF Code".
 * Ele exibe um título, uma breve descrição do propósito da comunidade e uma lista
 * de estatísticas com seus respectivos valores e descrições.
 *
 * A seção inclui um efeito de fundo decorativo com um gradiente e blur para
 * adicionar profundidade visual.
 *
 * Os dados das estatísticas são atualmente definidos estaticamente no componente,
 * mas podem ser adaptados para serem carregados dinamicamente no futuro.
 *
 * Este componente não recebe props.
 *
 * @returns {JSX.Element} Um elemento `<section>` contendo a apresentação das estatísticas.
 *
 * @example
 * // Em uma página principal ou de "Sobre Nós":
 * import { Stats } from '@/components/Stats';
 *
 * export default function HomePage() {
 *   return (
 *     <>
 *       {/* ... outros conteúdos da página ... *\/}
 *       <Stats />
 *       {/* ... outros conteúdos da página ... *\/}
 *     </>
 *   );
 * }
 */
export function Stats() {
  // Renomeei a constante interna para evitar conflito com uma possível importação global
  // e para seguir a nomenclatura definida na interface.
  const currentStats: StatItem[] = statsData;

  return (
    // Seção principal com padding vertical e posicionamento relativo para o efeito de fundo.
    <section className="py-20 md:py-28 my-24 md:my-32 relative"> {/* Ajustado padding e margem para responsividade */}
      {/* Container para o conteúdo, com z-index para ficar acima do efeito de fundo. */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8"> {/* Ajustado padding horizontal */}
        {/* Cabeçalho da seção: título e parágrafo descritivo. */}
        <div className="max-w-2xl xl:mx-auto xl:text-center">
          <h3 className="text-gray-800 dark:text-white text-3xl font-semibold sm:text-4xl">
            A comunidade do IF Code está crescendo
          </h3>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Nosso compromisso é ajudar estudantes de informática a evoluírem e superarem desafios juntos. Confira alguns números da nossa plataforma:
          </p>
        </div>
        {/* Lista de estatísticas. */}
        <div className="mt-12">
          <ul className="flex flex-wrap gap-x-8 sm:gap-x-12 gap-y-10 items-start sm:items-center justify-center space-y-8 sm:space-y-0 sm:flex xl:justify-center"> {/* Ajustado `items-start` e `justify-center` */}
            {
              // Mapeia os dados de `currentStats` para renderizar cada item de estatística.
              currentStats.map((item, idx) => (
                <li key={idx} className="sm:max-w-[15rem] text-center sm:text-left"> {/* Adicionado text-center para mobile */}
                  {/* Valor da estatística. */}
                  <h4 className="text-4xl text-indigo-600 dark:text-indigo-400 font-semibold">
                    {item.data}
                  </h4>
                  {/* Descrição da estatística. */}
                  <p className="mt-2 sm:mt-3 text-gray-500 dark:text-gray-400 font-medium">
                    {item.desc}
                  </p>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      {/* Elemento de fundo decorativo com gradiente e blur.
          Posicionado absolutamente para cobrir a área atrás do conteúdo. */}
      <div
        className="absolute inset-0 max-w-md mx-auto h-80 blur-[118px] sm:h-72 opacity-30 dark:opacity-50" // Adicionada opacidade
        style={{
          background: "linear-gradient(152.92deg, rgba(137, 255, 173, 0.2) 4.54%, rgba(105, 255, 167, 0.26) 34.2%, rgba(23, 255, 73, 0.1) 77.55%)"
        }}
        aria-hidden="true" // Elemento decorativo, esconder de leitores de tela.
      ></div>
    </section>
  )
}