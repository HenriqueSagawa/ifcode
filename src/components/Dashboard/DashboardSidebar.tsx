"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Sheet, SheetContent } from "../ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Usuários",
    href: "/dashboard/users",
    icon: Users
  },
  {
    title: "Mensagens",
    href: "/dashboard/messages",
    icon: MessageSquare
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings
  },
  {
    title: "Ajuda",
    href: "/dashboard/help",
    icon: HelpCircle
  }
];

export function DashboardSidebar({ isOpen, setIsOpen }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 lg:block">
        <SidebarContent />
      </aside>
    </>
  );
}

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r bg-white dark:bg-black">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/img/logo ifcode.png"
            width={32}
            height={32}
            alt="IF Code"
          />
          <span className="text-lg font-semibold">IF Code</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href &&
                "bg-primary/10 dark:bg-primary/20"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-5 w-5" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
} 