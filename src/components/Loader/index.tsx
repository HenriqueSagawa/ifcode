/**
 * @file Loader.tsx - Componente de Indicador de Carregamento (Spinner).
 * @module common/Loader (ou o caminho correto no seu projeto)
 *
 * @description
 * O componente `Loader` renderiza um indicador visual de carregamento (spinner)
 * para informar ao usuário que uma operação está em andamento.
 * É útil para exibir durante chamadas de API, processamento de dados ou
 * qualquer tarefa assíncrona que possa levar algum tempo.
 *
 * O spinner é um SVG animado que utiliza a classe `animate-spin` do Tailwind CSS
 * para a animação de rotação. Ele consiste em dois paths: um círculo de fundo
 * e um arco que representa a parte móvel do spinner.
 *
 * @param {any} className - (Parâmetro direto, não uma prop de um objeto)
 *                          Uma string contendo classes CSS adicionais para serem aplicadas
 *                          ao elemento `div` raiz do loader. Permite customizar o
 *                          estilo do container do loader, como tamanho, margens, etc.
 *                          É opcional.
 *                          *Nota: O tipo original é `any`. Para melhor type safety,
 *                          considere usar `string | undefined`.*
 *
 * @returns {JSX.Element} Um elemento `div` contendo um SVG animado de spinner.
 *                        Retorna `null` se o componente não deveria ser renderizado
 *                        (embora este componente sempre renderize algo se chamado).
 *
 * @example
 * // Uso básico sem classes adicionais:
 * // (Neste caso, como `className` é o único parâmetro, você pode precisar
 * // chamar com `undefined` ou uma string vazia se nenhuma classe for necessária,
 * // dependendo de como o componente é usado e se o parâmetro é verdadeiramente opcional
 * // em todos os cenários de uso.)
 * import { Loader } from './Loader'; // Ajuste o caminho conforme necessário
 *
 * function MyPageComponent() {
 *   const [isLoading, setIsLoading] = useState(true);
 *
 *   // ... lógica para buscar dados ...
 *
 *   if (isLoading) {
 *     return <Loader className="" />; // Ou <Loader className={undefined} />
 *   }
 *
 *   return <div>Conteúdo da página carregado!</div>;
 * }
 *
 * @example
 * // Uso com classes de estilização customizadas para o container:
 * <Loader className="h-48 w-full bg-gray-100 rounded-md" />
 *
 * @suggestion
 * Para alinhar com as convenções mais comuns de componentes React onde as props
 * são passadas como um objeto, você poderia considerar alterar a assinatura da função para:
 * ```typescript
 * interface LoaderProps {
 *   className?: string;
 * }
 *
 * export function Loader({ className }: LoaderProps) {
 *   // ... implementação ...
 * }
 * ```
 * Isso tornaria o uso de props mais explícito e alinhado com o ecossistema React.
 */
export function Loader(className: any) { // Assinatura original do componente
    return (
        // Container principal do loader.
        // - `grid place-items-center`: Centraliza o SVG filho (o spinner).
        // - `min-h-[140px] w-full`: Define uma altura mínima e largura total por padrão.
        // - `overflow-x-scroll lg:overflow-visible`: Controla o comportamento de overflow.
        // - `rounded-lg p-6`: Estilos de borda arredondada e padding.
        // - `${className || ''}`: Interpola as classes customizadas passadas via parâmetro.
        //                      O `|| ''` garante que, se `className` for undefined,
        //                      não haverá "undefined" literal na string de classes.
        <div
            className={`grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible ${
                className || ""
            }`}
        >
            {/*
                Elemento SVG que representa o spinner animado.
                - `className="text-gray-300 animate-spin"`:
                    - `text-gray-300`: Define a cor base do SVG (usada pelo primeiro <path> via `stroke="currentColor"`).
                    - `animate-spin`: Classe do Tailwind CSS que aplica a animação de rotação.
                - `width="24"` e `height="24"`: Dimensões padrão do SVG.
                - Atributos de acessibilidade:
                    - `role="status"`: Indica que o elemento descreve o status de uma operação.
                    - `aria-busy="true"`: Informa que a região controlada pelo loader está ocupada.
            */}
            <svg
                className="text-gray-300 animate-spin"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                role="status"
                aria-busy="true"
            >
                {/* Path 1: Círculo de fundo do spinner (mais claro) */}
                <path
                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                    stroke="currentColor" // A cor é herdada da classe `text-gray-300` no elemento <svg>
                    strokeWidth="5" // Atributos SVG são case-sensitive; React os manipula corretamente.
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
                {/* Path 2: Arco animado do spinner (mais escuro, e branco em dark mode) */}
                <path
                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                    stroke="currentColor" // A cor é herdada da classe `text-gray-900 dark:text-white` neste <path>
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-900 dark:text-white" // Define a cor do arco e a cor para o modo escuro
                ></path>
            </svg>
        </div>
    );
}