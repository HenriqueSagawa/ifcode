"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FaUsers, 
  FaPhone, 
  FaPaperclip, 
  FaQuestion, 
  FaRobot, 
  FaBars 
} from "react-icons/fa";
import { signOut } from "next-auth/react";

// UI Components
import { Button as ButtonHeroUi } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Dropdown, DropdownTrigger, DropdownItem, DropdownMenu } from "@heroui/dropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "../ModeToggle";

// Types
interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: { text: string; url: string };
    signup: { text: string; url: string };
  };
  user?: User | null;
  onLogout?: () => void;
}

const NavbarContent = ({
  logo = {
    url: "/",
    src: '/img/logo ifcode.webp',
    alt: "logo do ifcode",
    title: "IF Code",
  },
  menu = [
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
  ],
  auth = {
    login: { text: "Entrar", url: "/login" },
    signup: { text: "Cadastre-se", url: "/register" },
  },
  user = null,
  onLogout = () => { signOut()},
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasSession = user !== null && user !== undefined;



  console.log("essa é minha foto", user?.image);

  const renderDesktopMenuItem = (item: MenuItem) => {
    if (item.items) {
      return (
        <NavigationMenuItem key={item.title} className="text-muted-foreground" style={{ zIndex: 100 }}>
          <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-80 p-3]" style={{ zIndex: 100 }}>
              <NavigationMenuLink className="z-50">
                {item.items.map((subItem) => (
                  <li key={subItem.title} style={{ zIndex: 100 }}>
                    <Link
                      className="flex z-40 select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
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
      );
    }

    return (
      <Link
        key={item.title}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
        href={item.url}
      >
        {item.title}
      </Link>
    );
  };

  return (
    <section className="h-16 !z-[999]">
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <Image 
                alt={logo.alt} 
                src={logo.src} 
                width={100} 
                height={100} 
                className="w-8" 
                quality={100} 
              />
              <span className="text-lg font-semibold">{logo.title}</span>
            </Link>

            {/* Menu */}
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderDesktopMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right side - Auth/User */}
          <div className="flex items-center gap-2 ">
            <ModeToggle />
            
            {hasSession ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar 
                    isBordered 
                    as="button" 
                    className="transition-transform" 
                    color="success" 
                    name={user?.name || "Usuário"} 
                    size="sm" 
                    src={user?.image || ""} 
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Conectado como</p>
                    <p className="font-semibold">{user?.email || "Email não disponível"}</p>
                  </DropdownItem>
                  <DropdownItem key="dashboard">
                    <Link href="/dashboard" className="block">Dashboard</Link>
                  </DropdownItem>
                  <DropdownItem key="profile-page">
                    <Link href={`/perfil/${user?.id}`} className="block">Meu perfil</Link>
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger">
                    <button 
                      className="w-full h-full text-left" 
                      onClick={onLogout}
                    >
                      Sair
                    </button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <>
                <Link href={auth.login.url}>
                  <ButtonHeroUi color="default" size="sm" variant="ghost">
                    {auth.login.text}
                  </ButtonHeroUi>
                </Link>
                <Link href={auth.signup.url}>
                  <ButtonHeroUi 
                    className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900" 
                    size="sm"
                  >
                    {auth.signup.text}
                  </ButtonHeroUi>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between mx-4">
            {/* Mobile Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <Image 
                alt={logo.alt} 
                src={logo.src} 
                width={100} 
                height={100} 
                className="w-8" 
                quality={100} 
              />
              <span className="text-lg font-semibold">{logo.title}</span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                      <Link href={logo.url} className="flex items-center gap-2">
                        <Image 
                          alt={logo.alt} 
                          src={logo.src} 
                          width={100} 
                          height={100} 
                          className="w-8" 
                          quality={100} 
                        />
                        <span className="text-lg font-semibold">{logo.title}</span>
                      </Link>
                    )}
                  </div>

                  {/* Mobile Menu */}
                  <div className="flex flex-col gap-2">
                    <Accordion type="single" collapsible className="w-full">
                      {menu.map((item, index) => (
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
                              {item.items?.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={subItem.url}
                                  className="flex items-center gap-2 py-2 px-2 text-sm rounded-md hover:bg-accent"
                                >
                                  {subItem.icon}
                                  <span>{subItem.title}</span>
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {/* Mobile User Actions */}
                    <div className="mt-4 pt-4 border-t">
                      {hasSession ? (
                        <div className="flex flex-col gap-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 py-2 px-2 text-sm rounded-md hover:bg-accent"
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/perfil"
                            className="flex items-center gap-2 py-2 px-2 text-sm rounded-md hover:bg-accent"
                          >
                            Perfil
                          </Link>
                          <ButtonHeroUi 
                            onPress={onLogout} 
                            variant="light" 
                            className="!text-left" 
                            color="danger"
                          >
                            Sair
                          </ButtonHeroUi>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Link href={auth.login.url}>
                            <Button onClick={() => setIsOpen(false)} color="default" size="sm" variant="ghost" className="w-full rounded border border-zinc-600">
                              {auth.login.text}
                            </Button>
                          </Link>
                          <Link href={auth.signup.url}>
                            <Button
                              className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 w-full rounded" 
                              size="sm"
                              onClick={() => setIsOpen(false)}
                            >
                              {auth.signup.text}
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
      </div>
    </section>
  );
};

export { NavbarContent };