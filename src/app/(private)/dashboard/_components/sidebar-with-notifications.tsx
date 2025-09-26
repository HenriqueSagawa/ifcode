"use client"

import { useEffect, useState } from "react"
import { getUnreadNotificationsCount } from "../_actions/get-notifications"
import { AppSidebar } from "./app-sidebar"

interface SidebarWithNotificationsProps {
  userId: string
}

export function SidebarWithNotifications({ userId }: SidebarWithNotificationsProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadNotificationsCount(userId)
        setUnreadCount(count)
      } catch (error) {
        console.error("Erro ao buscar contagem de notificações:", error)
      }
    }

    fetchUnreadCount()

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [userId])

  return <AppSidebar unreadNotificationsCount={unreadCount} />
}
