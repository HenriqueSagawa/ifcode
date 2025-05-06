// Indica que este é um Client Component no Next.js App Router.
// Necessário para hooks (useState, useEffect), interações do usuário (Popover) e chamadas ao Firebase.
"use client";

import React, { useState, useEffect } from "react";
import { BellIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"; // Ícones para UI
import { Button } from "@/components/ui/button"; // Componente de Botão
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Componente de Avatar
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Componente Popover para o dropdown
import { Badge } from "@/components/ui/badge"; // Componente Badge para contagem de não lidas
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
} from "firebase/firestore"; // Funções e tipos do Firebase Firestore
import { db } from "@/services/firebaseConnection"; // Instância do Firestore Database
import Link from "next/link"; // Componente Link do Next.js para navegação

/**
 * @interface Notification
 * @description Define a estrutura de um objeto de notificação.
 */
interface Notification {
  /** @prop {string} id - O ID único da notificação (geralmente o ID do documento no Firestore). */
  id: string;
  /** @prop {string} receiverId - O ID do usuário que recebe a notificação. */
  receiverId: string;
  /** @prop {string} senderId - O ID do usuário que enviou/gerou a notificação. */
  senderId: string;
  /** @prop {string} senderName - O nome do usuário que enviou a notificação. */
  senderName: string;
  /** @prop {string} senderAvatar - A URL do avatar do usuário que enviou a notificação. */
  senderAvatar: string;
  /** @prop {string} [postId] - O ID do post relacionado à notificação (opcional). */
  postId?: string;
  /** @prop {string} [postTitle] - O título do post relacionado (opcional). */
  postTitle?: string;
  /** @prop {"comment" | "like" | "follow" | "share" | string} type - O tipo da notificação. Permite tipos comuns e extensões. */
  type: "comment" | "like" | "follow" | "share" | string; // Permite tipos conhecidos e customizados
  /** @prop {string} [content] - Conteúdo adicional ou customizado da notificação (opcional). */
  content?: string;
  /** @prop {boolean} read - Indica se a notificação foi lida. */
  read: boolean;
  /** @prop {Timestamp | Date} createdAt - A data e hora em que a notificação foi criada. Pode ser um Timestamp do Firestore ou um objeto Date. */
  createdAt: Timestamp | Date; // Firestore Timestamp ou objeto Date JavaScript
  /** @prop {string} time - String formatada representando o tempo relativo desde a criação da notificação (ex: "5 minutos atrás"). */
  time: string;
}

/**
 * @interface NotificationDropdownProps
 * @description Define as propriedades esperadas pelo componente NotificationDropdown.
 */
interface Props {
  /** @prop {string} userId - O ID do usuário atualmente logado, para buscar suas notificações. */
  userId: string;
}

// Constante para o número inicial de notificações a serem exibidas.
const INITIAL_NOTIFICATIONS_COUNT = 4;

/**
 * @file NotificationDropdown.tsx - Componente Dropdown de Notificações.
 * @module components/NotificationDropdown (ou o caminho apropriado)
 *
 * @description
 * O componente `NotificationDropdown` exibe uma lista de notificações para o usuário logado.
 * Ele busca notificações do Firestore, mostra uma contagem de não lidas, permite marcar
 * todas como lidas, e oferece uma visualização paginada ("mostrar mais/menos").
 *
 * Funcionalidades:
 * - Busca notificações do Firestore associadas ao `userId`.
 * - Exibe um ícone de sino com um badge indicando o número de notificações não lidas.
 * - Ao clicar no sino, abre um popover com a lista de notificações.
 * - Formata o tempo das notificações de forma relativa (ex: "5 minutos atrás").
 * - Formata o conteúdo da notificação com base no seu tipo.
 * - Permite ao usuário "Marcar todas como lidas".
 * - Exibe inicialmente um número limitado de notificações (`INITIAL_NOTIFICATIONS_COUNT`).
 * - Permite ao usuário "Ver todas as notificações" ou "Mostrar menos notificações".
 * - Lida com estados de carregamento e erro durante a busca de notificações.
 * - Cada notificação pode ser clicável, levando ao conteúdo relacionado (ex: um post).
 *
 * @param {Props} props - As propriedades do componente, contendo `userId`.
 * @returns {JSX.Element} Um componente `Popover` contendo o dropdown de notificações.
 */
export function NotificationDropdown({ userId }: Props): JSX.Element {
  // Estados do componente
  const [unreadCount, setUnreadCount] = useState<number>(0); // Contagem de notificações não lidas.
  const [notifications, setNotifications] = useState<Notification[]>([]); // Notificações atualmente visíveis no dropdown.
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]); // Todas as notificações carregadas para o usuário.
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento das notificações.
  const [error, setError] = useState<string | null>(null); // Mensagem de erro, se houver.
  const [showAll, setShowAll] = useState<boolean>(false); // Controla se todas as notificações estão sendo exibidas ou apenas o subset inicial.
  const [isOpen, setIsOpen] = useState<boolean>(false); // Controla a visibilidade do popover.

  /**
   * @function formatRelativeTime
   * @description Formata um objeto Date para uma string de tempo relativo (ex: "5 minutos atrás").
   * @param {Date} date - A data a ser formatada.
   * @returns {string} A string de tempo relativo formatada.
   */
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seg atrás`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} d atrás`;
  };

  /**
   * Efeito para buscar as notificações do Firestore quando o componente é montado
   * ou quando o `userId` muda.
   */
  useEffect(() => {
    const fetchNotifications = async (): Promise<void> => {
      if (!userId) { // Não busca se userId não estiver definido
        setLoading(false);
        setNotifications([]);
        setAllNotifications([]);
        setUnreadCount(0);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const notificationsRef = collection(db, "notifications");
        // Query para buscar notificações onde 'receiverId' é igual ao 'userId' atual.
        const q = query(notificationsRef, where("receiverId", "==", userId));
        const querySnapshot = await getDocs(q);

        const notificationsData: Notification[] = [];
        let unreadCounter = 0;

        querySnapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
          const data = docSnap.data();
          // Converte Timestamp do Firestore para objeto Date, se necessário.
          const createdAtDate = data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt);

          const notification: Notification = {
            id: docSnap.id,
            receiverId: data.receiverId,
            senderId: data.senderId,
            senderName: data.senderName,
            senderAvatar: data.senderAvatar,
            postId: data.postId,
            postTitle: data.postTitle,
            type: data.type,
            content: data.content,
            read: data.read || false, // Garante que 'read' seja booleano.
            createdAt: data.createdAt, // Mantém o tipo original para ordenação
            time: formatRelativeTime(createdAtDate) // Formata o tempo relativo.
          };

          if (!notification.read) {
            unreadCounter++;
          }
          notificationsData.push(notification);
        });

        // Ordena as notificações pela data de criação (mais recentes primeiro).
        notificationsData.sort((a, b) => {
          const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        setAllNotifications(notificationsData);
        // Exibe inicialmente apenas o número definido por INITIAL_NOTIFICATIONS_COUNT.
        setNotifications(notificationsData.slice(0, INITIAL_NOTIFICATIONS_COUNT));
        setUnreadCount(unreadCounter);

      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
        const firestoreError = err as FirestoreError;
        setError(firestoreError.message || "Erro ao carregar notificações. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]); // Dependência: re-executa se userId mudar.

  /**
   * @function markAllAsRead
   * @description Marca todas as notificações do usuário como lidas, tanto localmente quanto no Firestore.
   * Realiza uma atualização otimista na UI.
   */
  const markAllAsRead = async (): Promise<void> => {
    const originalAllNotifications = [...allNotifications]; // Salva estado original para rollback
    const originalNotifications = [...notifications];
    const originalUnreadCount = unreadCount;

    try {
      // Atualização otimista da UI.
      const updatedAll = allNotifications.map(n => ({ ...n, read: true }));
      setAllNotifications(updatedAll);
      setNotifications(showAll ? updatedAll : updatedAll.slice(0, INITIAL_NOTIFICATIONS_COUNT));
      setUnreadCount(0);

      // Cria promessas para atualizar cada notificação não lida no Firestore.
      const promises = allNotifications
        .filter(notification => !notification.read)
        .map(notification =>
          updateDoc(doc(db, "notifications", notification.id), { read: true })
        );
      await Promise.all(promises);

    } catch (err) {
      console.error("Erro ao marcar notificações como lidas:", err);
      // Reverte para o estado anterior em caso de erro.
      setAllNotifications(originalAllNotifications);
      setNotifications(originalNotifications);
      setUnreadCount(originalUnreadCount);
      setError("Não foi possível marcar as notificações como lidas. Tente novamente.");
    }
  };

  /**
   * @function formatNotificationContent
   * @description Formata o texto descritivo da notificação com base no seu tipo.
   * @param {Notification} notification - O objeto de notificação.
   * @returns {string} O conteúdo formatado da notificação.
   */
  const formatNotificationContent = (notification: Notification): string => {
    switch (notification.type) {
      case "comment":
        return `comentou no seu post: "${notification.postTitle || 'postagem'}"`;
      case "like":
        return `curtiu sua publicação: "${notification.postTitle || 'postagem'}"`;
      case "follow":
        return `começou a seguir você`;
      case "share":
        return `compartilhou seu artigo: "${notification.postTitle || 'artigo'}"`;
      default:
        return notification.content || "realizou uma nova interação.";
    }
  };

  /**
   * @function toggleShowAllNotifications
   * @description Alterna a exibição entre um subset inicial de notificações e todas as notificações carregadas.
   */
  const toggleShowAllNotifications = (): void => {
    setShowAll(prevShowAll => {
      const newShowAll = !prevShowAll;
      if (newShowAll) {
        setNotifications(allNotifications); // Mostra todas
      } else {
        setNotifications(allNotifications.slice(0, INITIAL_NOTIFICATIONS_COUNT)); // Mostra o subset
      }
      return newShowAll;
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notificações. ${unreadCount} não lidas.`}>
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            // Badge para contagem de notificações não lidas.
            <Badge
              variant="destructive" // Usa a variante 'destructive' para cor vermelha padrão
              className="absolute -top-1 -right-1 h-4 w-4 min-w-[1rem] flex items-center justify-center p-0.5 text-xs rounded-full"
            >
              {unreadCount > 9 ? '9+' : unreadCount} {/* Limita a exibição a '9+' */}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0 shadow-xl rounded-lg"> {/* Ajuste de largura e estilo */}
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200">Notificações</h3>
          {unreadCount > 0 && (
            <Button
              variant="link" // Usar 'link' para melhor semântica e estilo
              size="sm"
              className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={markAllAsRead}
              disabled={loading} // Desabilita enquanto carrega ou atualiza
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        {/* Container com scroll para a lista de notificações. */}
        <div className={`overflow-y-auto custom-scrollbar ${showAll ? 'max-h-96' : 'max-h-[20rem]'}`}> {/* Ajuste de altura máxima */}
          {loading ? (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Carregando notificações...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-sm text-red-500 dark:text-red-400">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Você não tem nenhuma notificação no momento.
            </div>
          ) : (
            // Mapeia e renderiza cada notificação.
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <Avatar className="h-8 w-8 mt-0.5">
                  <AvatarImage src={notification.senderAvatar} alt={notification.senderName} />
                  <AvatarFallback className="text-xs">
                    {notification.senderName ? notification.senderName.substring(0, 2).toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-0.5">
                  {/* Link para o post relacionado, se houver. */}
                  <Link
                    href={notification.postId ? `/posts/${notification.postId}` : '#'}
                    className={`block ${notification.postId ? '' : 'pointer-events-none'}`}
                    onClick={() => {
                      if (notification.postId) setIsOpen(false); // Fecha o popover ao clicar em uma notificação com link
                    }}
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{notification.senderName}</span>{" "}
                      {formatNotificationContent(notification)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                  </Link>
                </div>
                {/* Indicador visual de notificação não lida. */}
                {!notification.read && (
                  <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 self-start shrink-0"></div>
                )}
              </div>
            ))
          )}
        </div>
        {/* Botão para "Ver todas" / "Mostrar menos". */}
        {!loading && allNotifications.length > INITIAL_NOTIFICATIONS_COUNT && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1"
              onClick={toggleShowAllNotifications}
            >
              {showAll ? (
                <>
                  Mostrar menos
                  <ChevronUpIcon className="h-4 w-4" />
                </>
              ) : (
                <>
                  Ver todas ({allNotifications.length})
                  <ChevronDownIcon className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}