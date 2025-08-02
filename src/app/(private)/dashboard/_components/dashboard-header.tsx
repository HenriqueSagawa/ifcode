"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { 
  FaUsers, 
  FaPhone, 
  FaPaperclip, 
  FaQuestion, 
  FaRobot 
} from "react-icons/fa"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const pageTitles: Record<string, string> = {
  "/": "Dashboard Principal",
  "/dashboard/perfil": "Meu Perfil",
  "/dashboard/publicacoes": "Publicações",
  "/dashboard/comentarios": "Comentários",
  "/dashboard/notificacoes": "Notificações",
  "/dashboard/configuracoes": "Configurações",
}

const menuItems = [
  {
    title: "Sobre nós",
    url: "#",
    items: [
      {
        title: "Quem somos?",
        description: "Conheça um pouco mais sobre nós, a equipe por trás do IF Code",
        icon: <FaUsers className="size-5 shrink-0" />,
        url: "/equipe",
      },
      {
        title: "Contato",
        description: "Entre em contato conosco para mais informações",
        icon: <FaPhone className="size-5 shrink-0" />,
        url: "/contato",
      },
      {
        title: "Sobre o Projeto",
        description: "Conheça um pouco da história de nosso projeto",
        icon: <FaPaperclip className="size-5 shrink-0" />,
        url: "/sobre",
      },
    ],
  },
  {
    title: "Serviços",
    url: "#",
    items: [
      {
        title: "Perguntas e respostas",
        description: "Encontre soluções para seus problemas ou ajude alguém",
        icon: <FaQuestion className="size-5 shrink-0" />,
        url: "/posts",
      },
      {
        title: "Converse com IA",
        description: "Converse com nosso chatbot para encontrar ajuda",
        icon: <FaRobot className="size-5 shrink-0" />,
        url: "/chat",
      },
    ],
  },
  {
    title: "Contato",
    url: "/contato",
  },
]

export function DashboardHeader() {
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] || "Dashboard"

  const renderMenuItem = (item: typeof menuItems[0]) => {
    if (item.items) {
      return (
        <NavigationMenuItem key={item.title} className="text-muted-foreground">
          <NavigationMenuTrigger className="h-8 px-3 text-sm">
            {item.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-80 p-3">
              <NavigationMenuLink>
                {item.items.map((subItem) => (
                  <li key={subItem.title}>
                    <Link
                      className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                      href={subItem.url}
                    >
                      {subItem.icon}
                      <div>
                        <div className="text-sm font-semibold">
                          {subItem.title}
                        </div>
                        {subItem.description && (
                          <p className="text-sm leading-snug text-muted-foreground">
                            {subItem.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </NavigationMenuLink>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      )
    }

    return (
      <NavigationMenuItem key={item.title}>
        <Link
          className="group inline-flex h-8 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
          href={item.url}
        >
          {item.title}
        </Link>
      </NavigationMenuItem>
    )
  }

  return (
    <header className="flex h-16 !-mt-4 border-zinc-600 shrink-0 items-center gap-2 border-b px-4 bg-zinc-50 dark:bg-zinc-900">
      <div className="flex items-center gap-4"> 
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
        
        {/* Menu de Navegação */}
        <div className="hidden md:block ml-6">
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((item) => renderMenuItem(item))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}