'use server'

import { doc, getDoc, collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { PostProps, Comment, commentStatus } from '@/types/posts'
import type { User } from '@/../types/next-auth'
import { revalidatePath } from 'next/cache'
import { createCommentNotification } from '@/actions/notifications'
import { checkUserSuspension } from '@/lib/suspension'

export interface PostWithAuthor extends PostProps {
  author: User;
}

export interface PostPageData {
  post: PostWithAuthor | null;
  comments: (Comment & { author: User })[];
  error?: string;
}

const userCache = new Map<string, User | null>();

async function getUserById(userId: string): Promise<User | null> {
  if (userCache.has(userId)) {
    return userCache.get(userId) || null;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    
    if (!userDoc.exists()) {
      console.warn(`Usuário não encontrado: ${userId}`)
      userCache.set(userId, null);
      return null
    }

    const userData = userDoc.data()
    const user: User = {
      id: userDoc.id,
      name: userData.name || 'Usuário Desconhecido',
      email: userData.email || '',
      image: userData.image || userData.avatar,
      bio: userData.bio,
      birthDate: userData.birthDate,
      createdAt: userData.createdAt,
      github: userData.github,
      phone: userData.phone,
      bannerImage: userData.bannerImage,
      skills: userData.skills || [],
      fullData: userData.fullData,
    }

    // Armazenar no cache
    userCache.set(userId, user);
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    userCache.set(userId, null);
    return null
  }
}

function createDefaultUser(userId: string): User {
  return {
    id: userId,
    name: 'Usuário Desconhecido',
    email: '',
    image: '/placeholder.svg?height=40&width=40'
  }
}

// Buscar post por ID com autor
export async function getPostById(postId: string): Promise<PostWithAuthor | null> {
  try {
    // Buscar o post
    const postDoc = await getDoc(doc(db, 'posts', postId))
    
    if (!postDoc.exists()) {
      console.warn(`Post não encontrado: ${postId}`)
      return null
    }

    const postData = postDoc.data() as Omit<PostProps, 'id'>
    
    // Buscar o autor do post
    const author = await getUserById(postData.userId) || createDefaultUser(postData.userId)

    return {
      id: postDoc.id,
      ...postData,
      author
    }
  } catch (error) {
    console.error('Erro ao buscar post:', error)
    return null
  }
}

// Interface para dados do comentário no Firestore
interface CommentData {
  content: string;
  createdAt: string;
  likes: number;
  userId: string;
  postId: string;
  status: commentStatus
  receivedUserId?: string;
}

// Buscar comentários do post com autores (OTIMIZADO)
export async function getPostComments(postId: string): Promise<(Comment & { author: User })[]> {
  try {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    )
    
    const commentsSnapshot = await getDocs(commentsQuery)
    
    if (commentsSnapshot.empty) {
      return []
    }

    // Coletar todos os userIds únicos dos comentários
    const userIds = new Set<string>()
    const commentsData = commentsSnapshot.docs.map(doc => {
      const data = doc.data() as CommentData
      return {
        id: doc.id,
        ...data
      }
    })

    commentsData.forEach(comment => {
      if (comment.userId) {
        userIds.add(comment.userId)
      }
    })

    // Buscar todos os usuários em paralelo
    const userPromises = Array.from(userIds).map(userId => 
      getUserById(userId).then(user => ({ userId, user }))
    )
    
    const userResults = await Promise.all(userPromises)
    
    // Criar mapa de usuários para acesso rápido
    const usersMap = new Map<string, User>()
    userResults.forEach(({ userId, user }) => {
      usersMap.set(userId, user || createDefaultUser(userId))
    })

    // Montar comentários com autores
    const comments: (Comment & { author: User })[] = commentsData.map(commentData => ({
      id: commentData.id,
      content: commentData.content,
      createdAt: commentData.createdAt,
      likes: commentData.likes || 0,
      isLiked: false, // Será definido pela lógica do cliente
      userId: commentData.userId,
      author: usersMap.get(commentData.userId) || createDefaultUser(commentData.userId),
      status: commentData.status,
      receivedUserId: commentData.receivedUserId
    }))
    
    return comments
  } catch (error) {
    console.error('Erro ao buscar comentários:', error)
    return []
  }
}

export async function getPostPageData(postId: string): Promise<PostPageData> {
  try {
    const [post, comments] = await Promise.all([
      getPostById(postId),
      getPostComments(postId)
    ])

    if (!post) {
      return {
        post: null,
        comments: [],
        error: 'Post não encontrado'
      }
    }

    return {
      post,
      comments
    }
  } catch (error) {
    console.error('Erro ao buscar dados da página:', error)
    return {
      post: null,
      comments: [],
      error: 'Erro interno do servidor'
    }
  }
}

export async function addComment(postId: string, content: string, userId: string): Promise<(Comment & { author: User }) | null> {
  try {
    // Verificar se o usuário está suspenso
    const suspensionStatus = await checkUserSuspension(userId);
    if (suspensionStatus.isSuspended) {
      throw new Error(`Usuário suspenso até ${new Date(suspensionStatus.suspendedUntil!).toLocaleString()}. Motivo: ${suspensionStatus.suspensionReason}`);
    }

    const post = await getPostById(postId);
    if (!post) {
      throw new Error('Post não encontrado');
    }

    // Buscar dados do usuário que está comentando
    const commenterUser = await getUserById(userId);
    if (!commenterUser) {
      throw new Error('Usuário que está comentando não encontrado');
    }

    const newComment = {
      content: content.trim(),
      postId,
      userId,
      receivedUserId: post.userId, 
      createdAt: new Date().toISOString(),
      likes: 0,
      status: "pending" as commentStatus
    }

    const docRef = await addDoc(collection(db, 'comments'), newComment)
    
    const author = commenterUser || createDefaultUser(userId)

    // 🚀 ENVIAR NOTIFICAÇÃO PARA O AUTOR DO POST
    // Só envia notificação se o comentarista não for o autor do post
    if (userId !== post.userId) {
      try {
        await createCommentNotification({
          postId: postId,
          postOwnerId: post.userId,
          postTitle: post.title || post.content?.substring(0, 50) || 'Publicação',
          actionUserId: userId,
          actionUserName: commenterUser.name,
          actionUserAvatar: commenterUser.image,
          commentText: content.trim()
        })
        
        console.log(`✅ Notificação de comentário enviada para o usuário ${post.userId}`)
      } catch (notificationError) {
        console.error('❌ Erro ao enviar notificação de comentário:', notificationError)
        // Não falha a criação do comentário mesmo se a notificação falhar
      }
    } else {
      console.log('⏭️ Notificação não enviada: usuário comentou no próprio post')
    }

    revalidatePath("/posts/[id]");
    
    return {
      id: docRef.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      likes: newComment.likes,
      isLiked: false,
      userId: newComment.userId,
      author,
      status: newComment.status
    }
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error)
    return null
  }
}