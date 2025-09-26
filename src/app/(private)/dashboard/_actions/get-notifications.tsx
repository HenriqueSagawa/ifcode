"use server"

import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'like' | 'comment' | 'follow'
  read: boolean
  createdAt: any
  updatedAt: any
  actionUserId?: string
  actionUserName?: string
  actionUserAvatar?: string
  postId?: string
  postTitle?: string
  postImage?: string
  actionType?: 'like' | 'comment' | 'follow' | 'mention' | 'system'
}

export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  try {
    if (!userId || !db) {
      return 0
    }

    const notificationsRef = collection(db, "notification")
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      where("read", "==", false)
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.size

  } catch (error) {
    console.error("❌ Erro ao buscar contagem de notificações não lidas:", error)
    return 0
  }
}

export async function getRecentNotifications(userId: string, limitCount: number = 5): Promise<Notification[]> {
  try {
    if (!userId || !db) {
      return []
    }

    const notificationsRef = collection(db, "notification")
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    
    const notifications: Notification[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId || "",
        title: data.title || "",
        message: data.message || "",
        type: data.type || "info",
        read: data.read || false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        actionUserId: data.actionUserId,
        actionUserName: data.actionUserName,
        actionUserAvatar: data.actionUserAvatar,
        postId: data.postId,
        postTitle: data.postTitle,
        postImage: data.postImage,
        actionType: data.actionType
      } as Notification
    })

    return notifications

  } catch (error) {
    console.error("❌ Erro ao buscar notificações recentes:", error)
    return []
  }
}
