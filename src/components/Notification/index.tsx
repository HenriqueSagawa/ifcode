"use client";

import { useState, useEffect } from "react";
import { BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  where,
  Timestamp,
  FirestoreError,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import Link from "next/link";

// Definindo tipos para notificação
interface Notification {
  id: string;
  receiverId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  postId?: string;
  postTitle?: string;
  type: "comment" | "like" | "follow" | "share" | string;
  content?: string;
  read: boolean;
  createdAt: Timestamp | Date;
  time: string;
}

export function NotificationDropdown(): JSX.Element {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para formatar a data relativa
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutos atrás`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)} horas atrás`;
    } else {
      return `${Math.floor(diffInMinutes / (60 * 24))} dias atrás`;
    }
  };

  // Função para carregar notificações do Firestore
  useEffect(() => {
    const fetchNotifications = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Obter ID do usuário da sessão atual
        // Em um app real, isso viria do seu sistema de autenticação
        const currentUserId = "dcZNOfJPbR6oFxpTH1qC"; // Use seu método de autenticação aqui

        const notificationsRef = collection(db, "notifications");
        const q = query(notificationsRef, where("receiverId", "==", currentUserId));

        const querySnapshot = await getDocs(q);

        const notificationsData: Notification[] = [];
        let unreadCounter = 0;

        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();

          const createdAtDate = data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt);

          const notification: Notification = {
            id: doc.id,
            receiverId: data.receiverId,
            senderId: data.senderId,
            senderName: data.senderName,
            senderAvatar: data.senderAvatar,
            postId: data.postId,
            postTitle: data.postTitle,
            type: data.type,
            content: data.content,
            read: data.read || false,
            createdAt: data.createdAt,
            time: formatRelativeTime(createdAtDate)
          };

          // Incrementar contador de não lidas
          if (!notification.read) {
            unreadCounter++;
          }

          notificationsData.push(notification);
        });

        // Ordenar por data de criação (mais recentes primeiro)
        notificationsData.sort((a, b) => {
          const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        setNotifications(notificationsData);
        setUnreadCount(unreadCounter);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        setError(error instanceof FirestoreError ? error.message : "Erro ao carregar notificações");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async (): Promise<void> => {
    try {
      // Atualizar estado localmente primeiro para UI responsiva
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));

      setNotifications(updatedNotifications);
      setUnreadCount(0);

      // Atualizar no Firestore
      const promises = notifications
        .filter(notification => !notification.read)
        .map(notification =>
          updateDoc(doc(db, "notifications", notification.id), {
            read: true
          })
        );

      await Promise.all(promises);
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
      // Reverter estado em caso de erro
      const originalNotifications = [...notifications];
      setNotifications(originalNotifications);

      const unreadCounter = originalNotifications.filter(n => !n.read).length;
      setUnreadCount(unreadCounter);

      setError("Não foi possível marcar as notificações como lidas");
    }
  };

  const formatNotificationContent = (notification: Notification): string => {
    // Baseado no tipo de notificação, formatar o conteúdo adequadamente
    switch (notification.type) {
      case "comment":
        return `comentou no seu post '${notification.postTitle}'`;
      case "like":
        return "curtiu sua publicação";
      case "follow":
        return "está seguindo você agora";
      case "share":
        return "compartilhou seu artigo";
      default:
        return notification.content || "interagiu com você";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notificações</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Carregando notificações...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Você não tem notificações
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 hover:bg-gray-50 text-gray-600 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={notification.senderAvatar} alt={notification.senderName} />
                  <AvatarFallback>{notification.senderName ? notification.senderName[0] : '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <Link href={`/posts/${notification.postId}`}>
                    <p className="text-sm hover:underline">
                      <span className="font-medium">{notification.senderName}</span>{" "}
                      {formatNotificationContent(notification)}
                    </p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </Link>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm text-gray-600 hover:text-gray-800"
          >
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}