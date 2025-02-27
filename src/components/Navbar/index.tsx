import { FaUsers, FaPhone, FaPaperclip, FaQuestion, FaRobot, FaBars } from "react-icons/fa";
import LogoIFCode from "../../../public/img/logo ifcode.png";
import Image from "next/image";
import { ModeToggle } from "../ModeToggle";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";

/**
 * Interface para definir a estrutura de um item de menu.
 */
interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

/**
 * Interface para definir a estrutura das props do componente Navbar.
 */
interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup: {
      text: string;
      url: string;
    };
  };
}

/**
 * Componente que renderiza a barra de navegação (Navbar) da aplicação.
 *
 * Este componente exibe o logo, os links do menu, o botão de alternância de tema
 * e os botões de login e cadastro. Ele se adapta a diferentes tamanhos de tela,
 * exibindo um menu responsivo em telas menores.
 *
 * @param {Navbar1Props} props - As propriedades do componente Navbar.
 * @returns {JSX.Element} A barra de navegação renderizada.
 */
const Navbar = ({
  logo = {
    url: "/",
    src: 'https://i.imgur.com/UJCtFtt.png',
    alt: "logo",
    title: "IF Code",
  },
  menu = [
    {
      title: "Sobre nós",
      url: "#",
      items: [
        {
          title: "Quem somos?",
          description: "Lorem ipsum dolor sit amet consectetur adipisicing.",
          icon: <FaUsers className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Contato",
          description: "Our mission is to innovate and empower the world",
          icon: <FaPhone className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Sobre o Projeto",
          description: "Browse job listing and discover our workspace",
          icon: <FaPaperclip className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Serviços",
      url: "#",
      items: [
        {
          title: "Perguntas e respostas",
          description: "Get all the answers you need right here",
          icon: <FaQuestion className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Converse com IA",
          description: "We are here to help you with any questions you have",
          icon: <FaRobot className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Documentação",
      url: "#",
    },
  ],
  auth = {
    login: { text: "Entrar", url: "/login" },
    signup: { text: "Cadastrar", url: "/register" },
  },
}: Navbar1Props) => {
  console.log(logo.title) // Exibe o título do logo no console (para fins de depuração).

  return (
    <section className="py-4">
      {/* Container principal da Navbar. */}
      <div className="container mx-auto">
        {/* Container para a Navbar em telas grandes. */}
        <nav className="hidden justify-between lg:flex">
          {/* Container para o logo e os links do menu. */}
          <div className="flex items-center gap-6">
            {/* Link para a página inicial. */}
            <a href={logo.url} className="flex items-center gap-2">
              <Image width={100} height={100} src={logo.src} className="w-8" alt={logo.alt} />
              {/* Logo da aplicação. */}
              <span className="text-lg font-semibold">{logo.title}</span>
              {/* Título da aplicação. */}
            </a>
            {/* Container para os links do menu. */}
            <div className="flex items-center">
              <NavigationMenu>
                {/* Componente para renderizar o menu de navegação. */}
                <NavigationMenuList>
                  {/* Lista de itens do menu. */}
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          {/* Container para os botões de alternância de tema, login e cadastro. */}
          <div className="flex gap-2">
            <ModeToggle />
            {/* Botão para alternar entre os temas claro e escuro. */}
            <Button asChild variant="outline" size="sm">
              {/* Botão de login. */}
              <a href={auth.login.url}>{auth.login.text}</a>
            </Button>
            <Button asChild size="sm">
              {/* Botão de cadastro. */}
              <a href={auth.signup.url}>{auth.signup.text}</a>
            </Button>
          </div>
        </nav>

        {/* Container para a Navbar em telas menores. */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between mx-4">
            {/* Link para a página inicial. */}
            <a href={logo.url} className="flex items-center gap-2">
              <Image src={LogoIFCode} className="w-8" alt={logo.alt} />
              {/* Logo da aplicação. */}
              <span className="text-lg font-semibold">{logo.title}</span>
              {/* Título da aplicação. */}
            </a>
            {/* Componente para exibir o menu em um Sheet (modal). */}
            <Sheet>
              <SheetTrigger asChild>
                {/* Botão para abrir o Sheet. */}
                <Button variant="outline" size="icon">
                  <FaBars className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                {/* Conteúdo do Sheet. */}
                <SheetHeader>
                  {/* Header do Sheet. */}
                  <SheetTitle>
                    {/* Título do Sheet. */}
                    <a href={logo.url} className="flex items-center gap-2">
                      <Image src={logo.src} className="w-8" alt={logo.alt} />
                      {/* Logo da aplicação. */}
                      <span className="text-lg font-semibold">
                        {logo.title}
                      </span>
                      {/* Título da aplicação. */}
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  {/* Container para os itens do menu e os botões de login/cadastro. */}
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {/* Componente para renderizar os itens do menu em um Accordion. */}
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <ModeToggle />
                  {/* Botão para alternar entre os temas claro e escuro. */}

                  <Separator />
                  {/* Linha divisória. */}

                  <div className="flex flex-col gap-3">
                    {/* Container para os botões de login e cadastro. */}
                    <Button asChild variant="outline">
                      {/* Botão de login. */}
                      <a href={auth.login.url}>{auth.login.text}</a>
                    </Button>
                    <Button asChild>
                      {/* Botão de cadastro. */}
                      <a href={auth.signup.url}>{auth.signup.text}</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Função para renderizar um item de menu (para telas grandes).
 *
 * @param {MenuItem} item - O item de menu a ser renderizado.
 * @returns {JSX.Element} O item de menu renderizado.
 */
const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    {/* Renderiza um item de menu com um dropdown. */}
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <a
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
                  </a>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  {/* Renderiza um item de menu simples (sem dropdown). */}
  return (
    <a
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {item.title}
    </a>
  );
};

/**
 * Função para renderizar um item de menu (para telas menores).
 *
 * @param {MenuItem} item - O item de menu a ser renderizado.
 * @returns {JSX.Element} O item de menu renderizado.
 */
const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    {/* Renderiza um item de menu com um Accordion. */}
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  {/* Renderiza um item de menu simples (sem Accordion). */}
  return (
    <a key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar };
