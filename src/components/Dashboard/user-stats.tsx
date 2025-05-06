// Diretiva do Next.js para Client Component, embora não seja estritamente necessária
// aqui (sem hooks), é boa prática se for usado em páginas client-side.
"use client";

// Importações de componentes UI (presumivelmente Shadcn/ui ou similar)
import { Card, CardContent } from "@/components/ui/card";
// Importações de ícones da biblioteca lucide-react
import { PenSquare, MessageSquare, ThumbsUp } from "lucide-react";
import React from "react"; // Importa React (necessário para React.ReactNode)

/**
 * @typedef {object} TrendData
 * @property {number} value - O valor percentual da tendência.
 * @property {boolean} positive - Indica se a tendência é positiva (true) ou negativa (false).
 */

/**
 * Props para o componente StatCard.
 * @typedef {object} StatCardProps
 * @property {string} title - O título ou rótulo da estatística (ex: "Total de Posts").
 * @property {number} value - O valor numérico da estatística.
 * @property {React.ReactNode} icon - O elemento React do ícone a ser exibido.
 * @property {TrendData} [trend] - Objeto opcional contendo dados sobre a tendência da estatística (valor percentual e se é positiva/negativa).
 */
type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode; // Tipo para aceitar componentes React como ícones
  trend?: { // Objeto opcional para a tendência
    value: number;
    positive: boolean;
  };
};

/**
 * Componente reutilizável que exibe um card individual de estatística.
 * Mostra um título, um valor numérico formatado, um ícone e, opcionalmente,
 * uma indicação de tendência (aumento ou diminuição percentual).
 *
 * @component
 * @param {StatCardProps} props - As propriedades do card de estatística.
 * @returns {JSX.Element} O elemento JSX que renderiza o card de estatística.
 */
function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    // Container principal do card de estatística com estilos base.
    <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm border dark:border-gray-700">
      {/* Layout flexível para alinhar texto e ícone */}
      <div className="flex items-center justify-between">
        {/* Bloco de Texto: Título, Valor e Tendência */}
        <div>
          {/* Título da estatística */}
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {/* Valor principal da estatística, formatado com separador de milhar */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</h3>
          {/* Exibe a tendência APENAS se a prop 'trend' for fornecida */}
          {trend && (
            // Texto da tendência com cor condicional (verde para positivo, vermelho para negativo)
            <p className={`text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
              {/* Adiciona '+' se a tendência for positiva */}
              {trend.positive ? '+' : ''}{trend.value}% desde o último mês {/* Texto fixo de período */}
            </p>
          )}
        </div>
        {/* Container do Ícone */}
        <div className="rounded-full bg-primary/10 p-2 flex-shrink-0"> {/* `flex-shrink-0` impede que o ícone encolha */}
          {/* O ícone passado via props */}
          {icon}
        </div>
      </div>
    </div>
  );
}

/**
 * Componente que exibe um resumo das estatísticas principais do usuário.
 * Renderiza múltiplos componentes `StatCard` dentro de um Card maior,
 * utilizando dados simulados para demonstração.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX que renderiza a seção de estatísticas do usuário.
 */
export function UserStats() {
  // --- Simulação de Dados de Estatísticas ---
  // Em uma aplicação real, estes dados provavelmente viriam de props ou de uma chamada API.
  // A estrutura de cada objeto corresponde às props esperadas por `StatCard`.
  const stats: StatCardProps[] = [ // Tipagem explícita do array
    {
      title: "Total de Posts",
      value: 147,
      icon: <PenSquare className="h-5 w-5 text-primary" />, // Ícone para posts
      trend: { value: 12.4, positive: true } // Tendência de aumento
    },
    {
      title: "Comentários",
      value: 842,
      icon: <MessageSquare className="h-5 w-5 text-primary" />, // Ícone para comentários
      trend: { value: 8.2, positive: true } // Tendência de aumento
    },
    {
      title: "Curtidas Recebidas",
      value: 3254,
      icon: <ThumbsUp className="h-5 w-5 text-primary" />, // Ícone para curtidas
      trend: { value: 24.1, positive: true } // Tendência de aumento
    }
    // Pode adicionar mais estatísticas aqui se necessário
  ];

  // --- Renderização do Componente ---
  return (
    // Card principal que agrupa todas as estatísticas.
    <Card>
      <CardContent className="p-6">
        {/* Título da seção de estatísticas */}
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Estatísticas do Usuário</h2>
        {/* Grid responsivo para organizar os StatCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mapeia o array 'stats' para renderizar um StatCard para cada item */}
          {stats.map((stat, index) => (
            // Passa todas as propriedades do objeto 'stat' para o componente StatCard usando spread operator.
            // Usa o índice como chave (idealmente, use um ID único se disponível nos dados reais).
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}