"use client"

import { Bell, Home, MessageSquare, Settings, FileText, User } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { SquareArrowOutUpRight } from "lucide-react"

import logo from "../../../../../public/img/logo ifcode.webp";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"

const menuItems = [
  {
    title: "Início",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Meu Perfil",
    url: "/dashboard/perfil",
    icon: User,
  },
  {
    title: "Publicações",
    url: "/dashboard/publicacoes",
    icon: FileText,
  },
  {
    title: "Comentários",
    url: "/dashboard/comentarios",
    icon: MessageSquare,
  },
  {
    title: "Notificações",
    url: "/dashboard/notificacoes",
    icon: Bell,
  },
  {
    title: "Configurações",
    url: "/dashboard/configuracoes",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-600 bg-sidebar-primary">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
            <Image src={logo} alt="Logo IFCode" width={100} height={100} />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden hover:text-zinc-300 transition-colors">
            <span className="text-sm font-medium">IFCode</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">Página Inicial <SquareArrowOutUpRight className="w-3 h-3" /> </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="h-9 px-3 font-normal rounded"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}