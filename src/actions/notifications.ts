'use server'

import { collection, query, where, orderBy, getDocs, doc, updateDoc, addDoc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase' // Assume que você tem a configuração do Firebase aqui

export interface Notification {
  id: string
  userId: string // ID do usuário que vai receber a notificação
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'like' | 'comment' | 'follow'
  read: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  // Informações sobre a ação
  actionUserId?: string // ID do usuário que executou a ação (curtiu, comentou, seguiu)
  actionUserName?: string // Nome do usuário que executou a ação
  actionUserAvatar?: string // Avatar do usuário que executou a ação
  // Informações sobre o post (se aplicável)
  postId?: string // ID do post relacionado
  postTitle?: string // Título ou preview do post
  postImage?: string // Imagem do post (se houver)
  // Metadados adicionais
  actionType?: 'like' | 'comment' | 'follow' | 'mention' | 'system'
}

export async function getNotificationsByUserId(userId: string): Promise<Notification[]> {
  try {
    const notificationsRef = collection(db, 'notification')
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const notifications: Notification[] = []
    
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      } as Notification)
    })
    
    return notifications
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    throw new Error('Falha ao carregar notificações')
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const notificationRef = doc(db, 'notification', notificationId)
    await updateDoc(notificationRef, {
      read: true,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error)
    throw new Error('Falha ao atualizar notificação')
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const notificationsRef = collection(db, 'notification')
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      where('read', '==', false)
    )
    
    const querySnapshot = await getDocs(q)
    const updatePromises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, {
        read: true,
        updatedAt: Timestamp.now()
      })
    )
    
    await Promise.all(updatePromises)
  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error)
    throw new Error('Falha ao atualizar notificações')
  }
}

// Interfaces para criar notificações
export interface CreateNotificationParams {
  userId: string // Quem vai receber a notificação
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'like' | 'comment' | 'follow'
  actionType?: 'like' | 'comment' | 'follow' | 'mention' | 'system'
  actionUserId?: string // Quem executou a ação
  actionUserName?: string
  actionUserAvatar?: string
  postId?: string
  postTitle?: string
  postImage?: string
}

export interface PostInteractionParams {
  postId: string
  postOwnerId: string // Dono do post que vai receber a notificação
  postTitle: string
  postImage?: string
  actionUserId: string // Quem está curtindo/comentando
  actionUserName: string
  actionUserAvatar?: string
}

// Função genérica para criar notificações
export async function createNotification(params: CreateNotificationParams): Promise<void> {
  try {
    // Não criar notificação se o usuário está interagindo com seu próprio conteúdo
    if (params.actionUserId && params.actionUserId === params.userId) {
      return
    }

    const notificationData = {
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type,
      read: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      ...(params.actionType && { actionType: params.actionType }),
      ...(params.actionUserId && { actionUserId: params.actionUserId }),
      ...(params.actionUserName && { actionUserName: params.actionUserName }),
      ...(params.actionUserAvatar && { actionUserAvatar: params.actionUserAvatar }),
      ...(params.postId && { postId: params.postId }),
      ...(params.postTitle && { postTitle: params.postTitle }),
      ...(params.postImage && { postImage: params.postImage })
    }

    const notificationsRef = collection(db, 'notification')
    await addDoc(notificationsRef, notificationData)
  } catch (error) {
    console.error('Erro ao criar notificação:', error)
    throw new Error('Falha ao criar notificação')
  }
}

// Função específica para notificação de curtida
export async function createLikeNotification(params: PostInteractionParams): Promise<void> {
  await createNotification({
    userId: params.postOwnerId,
    title: 'Nova curtida!',
    message: `${params.actionUserName} curtiu sua publicação "${params.postTitle}"`,
    type: 'like',
    actionType: 'like',
    actionUserId: params.actionUserId,
    actionUserName: params.actionUserName,
    actionUserAvatar: params.actionUserAvatar,
    postId: params.postId,
    postTitle: params.postTitle,
    postImage: params.postImage
  })
}

// Função específica para notificação de comentário
export async function createCommentNotification(params: PostInteractionParams & { commentText?: string }): Promise<void> {
  const message = params.commentText 
    ? `${params.actionUserName} comentou: "${params.commentText.substring(0, 50)}${params.commentText.length > 50 ? '...' : ''}" em sua publicação`
    : `${params.actionUserName} comentou em sua publicação "${params.postTitle}"`

  await createNotification({
    userId: params.postOwnerId,
    title: 'Novo comentário!',
    message,
    type: 'comment',
    actionType: 'comment',
    actionUserId: params.actionUserId,
    actionUserName: params.actionUserName,
    actionUserAvatar: params.actionUserAvatar,
    postId: params.postId,
    postTitle: params.postTitle,
    postImage: params.postImage
  })
}

// Função específica para notificação de follow
export async function createFollowNotification(params: {
  userId: string // Quem está sendo seguido
  followerId: string // Quem está seguindo
  followerName: string
  followerAvatar?: string
}): Promise<void> {
  await createNotification({
    userId: params.userId,
    title: 'Novo seguidor!',
    message: `${params.followerName} começou a te seguir`,
    type: 'follow',
    actionType: 'follow',
    actionUserId: params.followerId,
    actionUserName: params.followerName,
    actionUserAvatar: params.followerAvatar
  })
}

// Função para buscar detalhes do usuário (você deve adaptar baseado na sua estrutura)
export async function getUserDetails(userId: string): Promise<{
  name: string
  avatar?: string
} | null> {
  try {
    // Substitua por sua lógica de busca de usuário
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const userData = userSnap.data()
      return {
        name: userData.name || userData.displayName || 'Usuário',
        avatar: userData.avatar || userData.photoURL
      }
    }
    
    return null
  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error)
    return null
  }
}

// Função para buscar detalhes do post (você deve adaptar baseado na sua estrutura)
export async function getPostDetails(postId: string): Promise<{
  title: string
  image?: string
  ownerId: string
} | null> {
  try {
    const postRef = doc(db, 'posts', postId)
    const postSnap = await getDoc(postRef)
    
    if (postSnap.exists()) {
      const postData = postSnap.data()
      return {
        title: postData.title || postData.content?.substring(0, 50) || 'Publicação',
        image: postData.image || postData.images?.[0],
        ownerId: postData.userId || postData.authorId
      }
    }
    
    return null
  } catch (error) {
    console.error('Erro ao buscar detalhes do post:', error)
    return null
  }
}