"use client"

import { FaUsers, FaPhone, FaPaperclip, FaQuestion, FaRobot, FaBars } from "react-icons/fa";

import LogoIFCode from "../../../public/img/logo ifcode.png";
import Image from "next/image";
import { ModeToggle } from "../ModeToggle";
import { useSession, signOut } from "next-auth/react";
import { Button as ButtonHeroUi } from "@heroui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Dropdown, DropdownTrigger, DropdownItem, DropdownMenu as DrodownHeroui } from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import Link from "next/link";
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
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import { Spinner } from "@heroui/spinner";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface UserData {
  id?: string;
  name: string;
  email: string;
  birthDate: string;
  phone: string;
  course: string;
  period: string;
  registration: string;
  github: string;
  bio: string;
  profileImage: string;
  createdAt: string;
  fullData: boolean;
}

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

const Navbar = ({
  logo = {
    url: "/",
    src: '/img/logo ifcode.png',
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
          description: "Get all the answers you need right here",
          icon: <FaQuestion className="size-5 shrink-0" />,
          url: "/posts",
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
    signup: { text: "Cadastre-se", url: "/register" },
  },
}: Navbar1Props) => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);


  useEffect(() => {
    if (status === "authenticated") {
      getUser().then(user => {
        if (user) {
          setUser(user);
        }
      });
    }
  }, [session, status]);

  async function getUser() {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', "==", session?.user?.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const userData = doc.data() as UserData;
      const { id, ...rest } = userData;
      return { id: doc.id, ...rest }; // Return the user data
    } else {
      return null;
    }
  }

  function handleLogout() {
    signOut();
  }

  return (
    <section className="py-4 z-50">
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a href={logo.url} className="flex items-center gap-2">
              <Image alt="" src={logo.src} width={100} height={100} className="w-8" quality={100} />
              <span className="text-lg font-semibold">{logo.title}</span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />

            {status === "loading" ? (
                <Spinner size="sm" color="success" />
            ) : status === "authenticated" ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar isBordered as="button" className="transition-transform" color="success" name={session?.user?.name as string} size="sm" src={user?.profileImage} />
                </DropdownTrigger>
                <DrodownHeroui aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Conectado como</p>
                    <p className="font-semibold">{session?.user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="dashboard"><Link href="/dashboard" className="block">Dashboard</Link></DropdownItem>
                  <DropdownItem key="dashboard" href={`/perfil/${user?.id}`}>Meu perfil</DropdownItem>
                  <DropdownItem key="logout" color="danger">
                    <button className="w-full h-full text-left" onClick={handleLogout}>Sair</button>
                  </DropdownItem>
                </DrodownHeroui>
              </Dropdown>
            ) : (
              <>
                <Link href={auth.login.url}>
                  <ButtonHeroUi color="default" size="sm" variant="ghost">
                    {auth.login.text}
                  </ButtonHeroUi>
                </Link>
                <Link href={auth.signup.url}>
                  <ButtonHeroUi className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900" size="sm">
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
            <a href={logo.url} className="flex items-center gap-2">
              <Image src={LogoIFCode} className="w-8" alt={logo.alt} />
              <span className="text-lg font-semibold">{logo.title}</span>
            </a>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <FaBars className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  {/* Header com Avatar/Logo */}
                  <div className="flex items-center gap-4 pb-4 mb-4 border-b">
                    {status === "loading" ? (
                      <Spinner />
                    ) : status === "authenticated" ? (
                      <div className="flex items-center gap-3">
                        <Avatar isBordered as="button" className="transition-transform" color="success" name={session?.user?.name as string} size="sm" src={user?.profileImage} />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{session.user?.name}</span>
                          <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                        </div>
                      </div>
                    ) : (
                      <Link href={logo.url} className="flex items-center gap-2">
                        <Image src={LogoIFCode} className="w-8" alt={logo.alt} />
                        <span className="text-lg font-semibold">{logo.title}</span>
                      </Link>
                    )}
                  </div>

                  {/* Menu com Dropdowns */}
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

                    {/* Opções do Usuário ou Autenticação */}
                    <div className="mt-4 pt-4 border-t">
                      {status === "loading" ? (
                        <Spinner />
                      ) : status === "authenticated" ? (
                        <div className="flex flex-col gap-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 py-2 px-2 text-sm rounded-md hover:bg-accent"
                          >
                            Dashboard
                          </Link>
                          <Link
                            href={`/perfil/${user?.id}`}
                            className="flex items-center gap-2 py-2 px-2 text-sm rounded-md hover:bg-accent"
                          >
                            Perfil
                          </Link>
                          <ButtonHeroUi onPress={handleLogout} variant="light" className="!text-left" color="danger" >Sair</ButtonHeroUi>
                        </div>
                      ) : (
                        <>
                          <Link href={auth.login.url}>
                            <ButtonHeroUi color="default" size="sm" variant="ghost">
                              {auth.login.text}
                            </ButtonHeroUi>
                          </Link>
                          <Link href={auth.signup.url}>
                            <ButtonHeroUi className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900" size="sm">
                              {auth.signup.text}
                            </ButtonHeroUi>
                          </Link>
                        </>
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

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
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

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
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

  return (
    <a key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar };