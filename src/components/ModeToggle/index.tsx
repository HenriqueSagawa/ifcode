// Indica que este é um Client Component no Next.js App Router.
// Necessário para o uso do hook `useTheme` e interações do lado do cliente.
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react" // Ícones para representar os temas claro e escuro
import { useTheme } from "next-themes" // Hook para interagir com o sistema de temas do next-themes

import { Button } from "@/components/ui/button" // Componente de botão (provavelmente Shadcn/ui)

/**
 * @file ModeToggle.tsx - Componente para Alternar Tema (Claro/Escuro).
 * @module components/ModeToggle (ou o caminho apropriado)
 *
 * @description
 * O componente `ModeToggle` renderiza um botão que permite ao usuário
 * alternar entre o tema claro ("light") e o tema escuro ("dark") da aplicação.
 * Ele utiliza o hook `useTheme` da biblioteca `next-themes` para gerenciar
 * o estado atual do tema e para aplicar a mudança.
 *
 * O botão exibe um ícone de sol para o tema claro e um ícone de lua para o tema escuro,
 * com uma transição suave entre eles ao alternar.
 *
 * Este componente não recebe props.
 *
 * @returns {JSX.Element} Um componente `Button` que, ao ser clicado, alterna o tema da aplicação.
 *
 * @example
 * // Em um layout ou cabeçalho:
 * import { ModeToggle } from '@/components/ModeToggle';
 *
 * export function Header() {
 *   return (
 *     <header>
 *       {/* ... outros elementos do cabeçalho ... *\/}
 *       <ModeToggle />
 *     </header>
 *   );
 * }
 */
export function ModeToggle() {
  // Hook `useTheme` do next-themes para acessar e modificar o tema atual.
  // `theme`: string contendo o tema atual ('light', 'dark', ou 'system').
  // `setTheme`: função para definir um novo tema.
  const { theme, setTheme } = useTheme();

  /**
   * @function toggleTheme
   * @description Alterna o tema atual entre 'light' e 'dark'.
   * Se o tema atual for 'dark', muda para 'light'. Caso contrário (incluindo 'light' ou 'system'
   * que resolveu para 'light'), muda para 'dark'.
   */
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Renderiza o botão de alternância de tema.
  return (
    <Button
      variant="outline" // Estilo do botão (geralmente com borda e fundo transparente).
      size="icon"      // Tamanho do botão, otimizado para conter apenas um ícone.
      onClick={toggleTheme} // Ação a ser executada ao clicar no botão.
      title="Alternar tema" // Atributo title para acessibilidade e tooltip.
      aria-label="Alternar tema entre claro e escuro" // Rótulo acessível mais descritivo.
    >
      {/* Ícone do Sol: Visível no tema claro, desaparece no tema escuro com animação. */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      {/* Ícone da Lua: Visível no tema escuro, desaparece no tema claro com animação.
          Posicionado absolutamente para sobrepor o ícone do Sol durante a transição. */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {/* Texto para leitores de tela, não visível na interface. */}
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}