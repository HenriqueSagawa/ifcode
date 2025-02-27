"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Componente que permite alternar entre os modos de tema (claro, escuro e sistema).
 *
 * Este componente utiliza a biblioteca `next-themes` para gerenciar o tema da aplicação
 * e renderiza um dropdown menu com opções para escolher o tema desejado.
 *
 * @returns {JSX.Element} O botão de alternância de tema renderizado.
 */
export function ModeToggle() {
  const { setTheme } = useTheme(); // Hook para acessar a função de definir o tema da aplicação.

  return (
    <DropdownMenu>
      {/* Dropdown menu para selecionar o tema. */}
      <DropdownMenuTrigger asChild>
        {/* Botão que abre o dropdown menu. */}
        <Button variant="outline" size="icon">
          {/* Ícone do sol (para o tema claro). */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {/* Ícone da lua (para o tema escuro). */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
          {/* Texto alternativo para acessibilidade. */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Conteúdo do dropdown menu. */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {/* Item para selecionar o tema claro. */}
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {/* Item para selecionar o tema escuro. */}
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {/* Item para selecionar o tema do sistema. */}
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
