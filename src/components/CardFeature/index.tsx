import { cn } from "@/lib/utils"; // Importa função utilitária para concatenar classes condicionalmente
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react"; // Importa ícones da biblioteca Tabler Icons
import React from "react"; // Importa React (necessário para JSX e ReactNode)

/**
 * @typedef {object} FeatureData
 * @property {string} title - O título da característica.
 * @property {string} description - A descrição detalhada da característica.
 * @property {JSX.Element} icon - O componente de ícone React que representa a característica.
 */

/**
 * Array contendo os dados para cada card de característica a ser exibido na seção "Sobre a plataforma".
 * Cada objeto representa uma característica com seu título, descrição e ícone correspondente.
 * @type {FeatureData[]}
 */
const features = [
  {
    title: "Criado para estudantes de informática",
    description:
      "Um espaço dedicado para quem está aprendendo programação, redes, banco de dados e muito mais. Compartilhe suas dúvidas e aprenda com a comunidade.",
    icon: <IconTerminal2 />,
  },
  {
    title: "Fácil de usar",
    description:
      "Interface intuitiva para que você possa focar no que realmente importa: aprender e trocar conhecimento sem dificuldades.",
    icon: <IconEaseInOut />,
  },
  {
    title: "Aprenda sem custo",
    description:
      "Aqui, o conhecimento é gratuito! Você pode acessar conteúdos, tirar dúvidas e ajudar outros estudantes sem pagar nada.",
    icon: <IconCurrencyDollar />,
  },
  {
    title: "Comunidade sempre ativa",
    description: "Poste suas dúvidas a qualquer momento! Sempre há alguém pronto para ajudar e compartilhar experiências.",
    icon: <IconCloud />,
  },
  {
    title: "Colaboração sem limites",
    description: "Compartilhe códigos, resoluções de problemas e ajude outros estudantes a evoluírem junto com você.",
    icon: <IconRouteAltLeft />,
  },
  {
    title: "Apoio contínuo",
    description:
      "Se precisar de uma explicação diferente, a comunidade está aqui para te dar novas perspectivas até você entender.",
    icon: <IconHelp />,
  },
  {
    title: "Tire suas dúvidas rapidamente",
    description:
      "Não fique preso em um problema por muito tempo! Publique suas perguntas e receba respostas de quem já passou por isso.",
    icon: <IconAdjustmentsBolt />,
  },
  {
    title: "Sempre em evolução",
    description: "O IF Code está em constante aprimoramento para oferecer sempre mais recursos e facilitar ainda mais sua jornada no mundo da informática.",
    icon: <IconHeart />,
  },
];

/**
 * Componente principal que renderiza a seção "Sobre a plataforma".
 * Ele exibe um título e um grid responsivo contendo vários cards de características (`Feature`).
 * Os dados das características são definidos no array `features`.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX que representa a seção de características.
 */
export function CardFeature() {
  return (
    <div>
      {/* Título da seção, responsivo para diferentes tamanhos de tela */}
      <h1 className="md:text-7xl sm:text-5xl text-3xl text-center font-bold">Sobre a plataforma</h1>
      {/* Container do grid de características */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 mt-12 mb-32 max-w-7xl mx-auto">
        {/* Mapeia o array de features para renderizar um componente Feature para cada item */}
        {features.map((feature, index) => (
          <Feature
            key={feature.title} // Chave única para cada item da lista (importante para o React)
            {...feature} // Passa todas as propriedades do objeto feature (title, description, icon)
            index={index} // Passa o índice do item, usado para estilização condicional no componente Feature
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Props para o componente Feature.
 * @typedef {object} FeatureProps
 * @property {string} title - O título da característica.
 * @property {string} description - A descrição da característica.
 * @property {React.ReactNode} icon - O nó React (geralmente um componente de ícone) a ser exibido.
 * @property {number} index - O índice do card no grid (usado para aplicar bordas condicionais).
 */

/**
 * Componente que renderiza um único card de característica dentro do grid.
 * Exibe um ícone, título e descrição. Aplica estilos de borda e efeitos de hover
 * com base na sua posição no grid e interação do usuário.
 *
 * @component
 * @param {FeatureProps} props - As propriedades do componente.
 * @returns {JSX.Element} O elemento JSX que representa um card de característica individual.
 */
const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        // Estilos base do card: flex column, borda direita em telas grandes, padding, etc.
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        // Adiciona borda esquerda no primeiro item de cada linha (índices 0 e 4 em grid de 4 colunas) em telas grandes
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        // Adiciona borda inferior para os itens da primeira linha (índices 0 a 3) em telas grandes
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {/* Efeito de gradiente suave no hover (para itens da primeira linha) */}
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {/* Efeito de gradiente suave no hover (para itens da segunda linha em diante) */}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {/* Container do ícone */}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      {/* Container do título */}
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        {/* Elemento decorativo (barra lateral) que reage ao hover */}
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-green-500 transition-all duration-200 origin-center" />
        {/* Título com efeito de translação no hover */}
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      {/* Container da descrição */}
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10 text-left">
        {description}
      </p>
    </div>
  );
};