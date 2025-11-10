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
import { UserProfileDropdown } from "@/components/UserProfile"
import { ModeToggle } from "@/components/ModeToggle"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { Button as ButtonHeroUi } from "@heroui/button"
import { Avatar } from "@heroui/avatar"
import { FaBars, FaShieldAlt } from "react-icons/fa"
import { signOut } from "next-auth/react"

// Types
interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "user" | "moderator" | "admin" | "superadmin";
}

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

interface DashboardHeaderProps {
  user?: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] || "Dashboard"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const hasSession = user !== null && user !== undefined
  const canModerate = user?.role === "moderator" || user?.role === "admin" || user?.role === "superadmin"

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
    <>
      {/* Header customizado para mobile com sidebar + navbar padrão */}
      <div className="lg:hidden">
        <section className="h-16 z-50">
          <div className="container mx-auto z-40">
            <div className="flex items-center justify-between mx-4">
              {/* Left side - Sidebar Trigger + Page Title */}
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-1 h-4" />
                <h1 className="text-sm sm:text-lg font-semibold truncate">{pageTitle}</h1>
              </div>

              {/* Right side - ModeToggle + Menu Button */}
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FaBars className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    {/* Mobile Header */}
                    <div className="flex items-center gap-4 pb-4 mb-4 border-b">
                      {hasSession ? (
                        <div className="flex items-center gap-3">
                          <Avatar 
                            isBordered 
                            as="button"
                            className="transition-transform" 
                            color="success" 
                            name={user!.name as string} 
                            size="sm" 
                            src={user!.image as string} 
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{user!.name}</span>
                            <span className="text-xs text-muted-foreground">{user!.email}</span>
                          </div>
                        </div>
                      ) : (
                        <Link href="/" className="flex items-center gap-2">
                          <Image 
                            alt="logo do ifcode" 
                            src="/img/logo ifcode.webp" 
                            width={100} 
                            height={100} 
                            className="w-8" 
                            quality={100} 
                          />
                          <span className="text-lg font-semibold">IF Code</span>
                        </Link>
                      )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="flex flex-col gap-2">
                      <Accordion type="single" collapsible className="w-full">
                        {menuItems.map((item, index) => (
                          item.items && item.items.length > 0 ? (
                            <AccordionItem
                              key={index}
                              value={`item-${index}`}
                              className="border-none"
                            >
                              <AccordionTrigger className="py-2 hover:bg-accent rounded-md px-2">
                                {item.title}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-col gap-1 pl-4">
                                  {item.items.map((subItem, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      href={subItem.url}
                                      className="flex items-center gap-2 py-2 px-2 text-sm rounded-md hover:bg-accent"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {subItem.icon}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ) : (
                            <Link
                              key={index}
                              href={item.url}
                              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span>{item.title}</span>
                            </Link>
                          )
                        ))}
                      </Accordion>

                      {/* Mobile User Actions */}
                      <div className="mt-4 pt-4 border-t">
                        {hasSession ? (
                          <div className="flex flex-col gap-1">
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-2 py-2 px-2 text-sm rounded-md hover:bg-accent"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Dashboard
                            </Link>
                            <Link
                              href={`/perfil/${user?.id}`}
                              className="flex items-center gap-2 py-2 px-2 text-sm rounded-md hover:bg-accent"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Perfil
                            </Link>
                            {canModerate && (
                              <Link
                                href="/moderation"
                                className="flex items-center gap-2 py-2 px-2 text-sm rounded-md hover:bg-accent"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <FaShieldAlt className="w-4 h-4" />
                                Painel de Moderação
                              </Link>
                            )}
                            <ButtonHeroUi 
                              onPress={() => {
                                signOut()
                                setIsMobileMenuOpen(false)
                              }} 
                              variant="light" 
                              className="!text-left" 
                              color="danger"
                            >
                              Sair
                            </ButtonHeroUi>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <Link href="/login">
                              <Button onClick={() => setIsMobileMenuOpen(false)} variant="ghost" className="w-full rounded border border-zinc-600">
                                Entrar
                              </Button>
                            </Link>
                            <Link href="/register">
                              <Button
                                className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 w-full rounded" 
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Cadastre-se
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Header da dashboard para desktop */}
      <header className="hidden lg:flex h-14 sm:h-16 !-mt-4 border-zinc-600 shrink-0 items-center gap-2 border-b px-3 sm:px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0"> 
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />
          <h1 className="text-sm sm:text-lg font-semibold truncate">{pageTitle}</h1>
          
          {/* Menu de Navegação */}
          <div className="ml-4 sm:ml-6">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Right side - User Profile */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <ModeToggle />
          <UserProfileDropdown user={user} />
        </div>
      </header>
    </>
  )
}