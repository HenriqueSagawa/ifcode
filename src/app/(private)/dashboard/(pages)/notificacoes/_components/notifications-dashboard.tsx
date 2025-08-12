'use client'

import { useState, useTransition } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Eye,
  ExternalLink,
  User,
  Circle
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { markNotificationAsRead, markAllNotificationsAsRead, type Notification } from '@/actions/notifications'
import { addToast } from '@heroui/toast'

// Header Component
export function NotificationsHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
          <Bell className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notificações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe suas atualizações e alertas
          </p>
        </div>
      </div>
    </div>
  )
}

// Main Notifications List Component
interface NotificationsListProps {
  notifications: Notification[]
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  const [optimisticNotifications, setOptimisticNotifications] = useState(notifications)
  const [isPending, startTransition] = useTransition()

  const unreadCount = optimisticNotifications.filter(n => !n.read).length

  const handleMarkAsRead = async (notificationId: string) => {
    // Optimistic update
    setOptimisticNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )

    startTransition(async () => {
      try {
        await markNotificationAsRead(notificationId)
        addToast({
          title: "Notificação marcada como lida",
          color: "default"
        })
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticNotifications(notifications)
        addToast({
          title: "Erro",
          description: "Não foi possível marcar a notificação como lida",
          color: "warning"
        })
      }
    })
  }

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return

    // Get user ID from first notification (assuming they all belong to the same user)
    const userId = optimisticNotifications[0]?.userId
    if (!userId) return

    // Optimistic update
    setOptimisticNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )

    startTransition(async () => {
      try {
        await markAllNotificationsAsRead(userId)
        addToast({
          title: "Todas as notificações foram marcadas como lidas",
          color: "default"
        })
      } catch (error) {
        setOptimisticNotifications(notifications)
        addToast({
          title: "Erro",
          description: "Não foi possível marcar todas as notificações como lidas",
          color: "default"
        })
      }
    })
  }

  if (optimisticNotifications.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma notificação
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Você não tem notificações no momento. Quando houver atualizações, elas aparecerão aqui.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats and Actions */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BellRing className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {optimisticNotifications.length} total
              </span>
            </div>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                {unreadCount} não lidas
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isPending}
              className="border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/10"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {optimisticNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
            isPending={isPending}
          />
        ))}
      </div>
    </div>
  )
}

// Individual Notification Card
interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  isPending: boolean
}

function NotificationCard({ notification, onMarkAsRead, isPending }: NotificationCardProps) {
  const getTypeIcon = (type: string, actionType?: string) => {
    // Ícones específicos para ações sociais
    if (actionType === 'like' || type === 'like') {
      return <Heart className="h-4 w-4 text-red-500 fill-current" />
    }
    if (actionType === 'comment' || type === 'comment') {
      return <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    }
    if (actionType === 'follow' || type === 'follow') {
      return <UserPlus className="h-4 w-4 text-green-600 dark:text-green-400" />
    }
    if (actionType === 'mention') {
      return <AtSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
    }

    // Ícones padrão por tipo
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    }
  }

  const getTypeColor = (type: string, actionType?: string) => {
    // Cores específicas para ações sociais
    if (actionType === 'like' || type === 'like') {
      return 'border-l-red-500'
    }
    if (actionType === 'comment' || type === 'comment') {
      return 'border-l-blue-500'
    }
    if (actionType === 'follow' || type === 'follow') {
      return 'border-l-green-500'
    }
    if (actionType === 'mention') {
      return 'border-l-purple-500'
    }

    // Cores padrão
    switch (type) {
      case 'success':
        return 'border-l-green-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'error':
        return 'border-l-red-500'
      default:
        return 'border-l-blue-500'
    }
  }

  const getDateFromCreatedAt = (createdAt: any): Date => {
    if (createdAt?.toDate) {
      // É um Firestore Timestamp
      return createdAt.toDate();
    } else if (createdAt instanceof Date) {
      // Já é um Date
      return createdAt;
    } else if (typeof createdAt === 'string') {
      // É uma string de data
      return new Date(createdAt);
    } else {
      // Fallback para data atual
      return new Date();
    }
  };

  return (
    <Card className={`border-gray-200 dark:border-gray-800 border-l-4 ${getTypeColor(notification.type, notification.actionType)} ${!notification.read ? 'bg-green-50/50 dark:bg-green-900/5' : ''} transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex space-x-4 flex-1">
            {/* Avatar do usuário que executou a ação ou ícone padrão */}
            <div className="flex-shrink-0 mt-1">
              {notification.actionUserAvatar ? (
                <div className="relative">
                  <img
                    src={notification.actionUserAvatar}
                    alt={notification.actionUserName || 'Usuário'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    {getTypeIcon(notification.type, notification.actionType)}
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {getTypeIcon(notification.type, notification.actionType)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h3 className={`text-sm font-semibold ${!notification.read
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300'
                  }`}>
                  {notification.title}
                </h3>

                {/* Indicador visual de não lida mais proeminente */}
                {!notification.read && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      Novo
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {notification.message}
              </p>

              {/* Informações do post (se aplicável) */}
              {notification.postId && notification.postTitle && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {notification.postImage && (
                      <img
                        src={notification.postImage}
                        alt="Post"
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {notification.postTitle}
                      </p>
                      <Link
                        href={`/post/${notification.postId}`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center mt-1"
                      >
                        Ver publicação <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações relacionadas ao usuário */}
              {notification.actionUserId && notification.actionUserName && (
                <div className="flex items-center space-x-3 mt-3">
                  <Link
                    href={`/perfil/${notification.actionUserId}`}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    <User className="h-3 w-3 mr-1" />
                    Ver perfil de {notification.actionUserName}
                  </Link>

                  {notification.postId && (
                    <span className="text-xs text-gray-400">•</span>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                {formatDistanceToNow(getDateFromCreatedAt(notification.createdAt), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </p>
            </div>
          </div>

          {/* Botões de ação mais intuitivos */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Botão para visualizar post (se aplicável) */}
            {notification.postId && (
              <Link href={`/post/${notification.postId}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  title="Ver publicação"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Botão de marcar como lida - mais visível e intuitivo */}
            {!notification.read ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                disabled={isPending}
                className="h-8 px-3 hover:bg-green-100 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-colors"
                title="Marcar como lida"
              >
                <Check className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Marcar como lida</span>
              </Button>
            ) : (
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Lida</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton
export function NotificationsSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}