"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";
import Image from "next/image";
import logoIfcode from "../../../public/img/logo ifcode.webp";


const components: { title: string; href: string; description: string }[] = [
  {
    title: "Perguntas e Respostas",
    href: "/",
    description:
      "Encontre respostas para suas principais dúvidas.",
  },
  {
    title: "Conversar com IA",
    href: "/",
    description:
      "Converse com nosso chatbot, especializado em ajudar você!",
  },
];

export default function Navigation() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Sobre nós</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/30 to-muted/10 p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Image src={logoIfcode} alt="Logo IF code" width={50} height={50} />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      IFCode
                    </div>
                    <p className="text-sm leading-tight text-zinc-500 dark:text-zinc-400">
                      Solucione suas dúvidas, busque inspiração e aprimore seus conhecimentos em programação com nossa plataforma de aprendizado colaborativo.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/" title="Quem somos">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur!
              </ListItem>
              <ListItem href="/" title="Sobre o Projeto">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </ListItem>
              <ListItem href="/" title="Contato">
                Lorem ipsum dolor sit amet consectetur.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Serviços</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href="/"
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentação
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-zinc-500 dark:text-zinc-400">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
