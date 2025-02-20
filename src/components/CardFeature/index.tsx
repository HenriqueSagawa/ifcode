import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function CardFeature() {
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 my-32 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

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
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-green-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
