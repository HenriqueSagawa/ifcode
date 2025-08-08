"use server"

import { db } from "@/lib/firebase"
import { commentStatus } from "@/types/posts";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore"

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  userId: string;
  user?: User;
  status?: commentStatus;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  bio?: string;
  birthDate?: string;
  createdAt?: string;
  github?: string;
  phone?: string;
  image?: string;
  bannerImage?: string;
  fullData?: any;
  skills?: string[];
}

export interface CommentWithUser extends Comment {
  user: User;
  postId: string;
  status: commentStatus;
  type: 'received' | 'made'; // Novo campo para distinguir o tipo
}

export interface DashboardStats {
  total: number;
  pendentes: number;
  aprovados: number;
  rejeitados: number;
  recebidos: number;
  feitos: number;
}

export async function getComentariosDoUsuario(authorUserId: string): Promise<{
  comentarios: CommentWithUser[]
  stats: DashboardStats
}> {
  try {
    // 1. Buscar comentários RECEBIDOS (usando receivedUserId)
    const comentariosRecebidosQuery = query(
      collection(db, "comments"),
      where("receivedUserId", "==", authorUserId)
    )
    const comentariosRecebidosSnapshot = await getDocs(comentariosRecebidosQuery)
    const comentariosRecebidos = comentariosRecebidosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment & { postId: string, status?: string }))

    // 2. Buscar comentários FEITOS pelo usuário (em qualquer post)
    const comentariosFeitosQuery = query(
      collection(db, "comments"),
      where("userId", "==", authorUserId)
    )
    const comentariosFeitosSnapshot = await getDocs(comentariosFeitosQuery)
    const comentariosFeitos = comentariosFeitosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment & { postId: string, status?: string }))

    // 3. Combinar todos os comentários
    const todosComentarios = [
      ...comentariosRecebidos.map(c => ({ ...c, type: 'received' as const })),
      ...comentariosFeitos.map(c => ({ ...c, type: 'made' as const }))
    ]

    // 4. Remover duplicatas (caso o usuário comente no próprio post)
    const comentariosUnicos = todosComentarios.filter((comentario, index, self) => 
      self.findIndex(c => c.id === comentario.id) === index
    )

    // 5. Buscar informações dos posts
    const postIds = Array.from(new Set(comentariosUnicos.map(c => c.userId)))
    const postsPromises = postIds.map(async (postId) => {
      const postDoc = await getDoc(doc(db, "posts", postId))
      if (!postDoc.exists()) {
        return { id: postId, title: "Post não encontrado" }
      }
      return { id: postId, ...postDoc.data() }
    })

    const posts = await Promise.all(postsPromises)
    const postsMap = new Map(posts.map(p => [p.id, p]))

    // 6. Buscar informações dos usuários
    const userIds = Array.from(new Set(comentariosUnicos.map(c => c.userId)))
    
    const usuariosPromises = userIds.map(async (userId) => {
      const userDoc = await getDoc(doc(db, "users", userId))
      if (!userDoc.exists()) {
        return {
          id: userId,
          name: "Usuário não encontrado",
          email: "email@exemplo.com"
        } as User
      }
      return {
        id: userId,
        ...userDoc.data()
      } as User
    })

    const usuarios = await Promise.all(usuariosPromises)
    const usuariosMap = new Map(usuarios.map(u => [u.id, u]))

    // 7. Combinar dados dos comentários com usuários e posts
    const comentariosCompletos: CommentWithUser[] = comentariosUnicos.map(comentario => ({
      id: comentario.id,
      content: comentario.content,
      createdAt: comentario.createdAt,
      likes: comentario.likes,
      isLiked: comentario.isLiked,
      userId: comentario.userId,
      postId: comentario.postId,
      status: (comentario.status as "pending" | "accepted" | "rejected") || "pending",
      type: comentario.type,
      user: usuariosMap.get(comentario.userId) || {
        id: comentario.userId,
        name: "Usuário não encontrado",
        email: "email@exemplo.com"
      }
    }))

    // 8. Calcular estatísticas
    const stats: DashboardStats = {
      total: comentariosCompletos.length,
      pendentes: comentariosCompletos.filter(c => c.status === "pending").length,
      aprovados: comentariosCompletos.filter(c => c.status === "accepted").length,
      rejeitados: comentariosCompletos.filter(c => c.status === "rejected").length,
      recebidos: comentariosCompletos.filter(c => c.type === "received").length,
      feitos: comentariosCompletos.filter(c => c.type === "made").length
    }

    // 9. Ordenar por data (mais recentes primeiro)
    comentariosCompletos.sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })

    return {
      comentarios: comentariosCompletos,
      stats
    }

  } catch (error) {
    console.error("Erro ao buscar comentários:", error)
    throw new Error("Falha ao carregar comentários")
  }
}

// Action para aprovar comentário
export async function aprovarComentario(comentarioId: string): Promise<void> {
  try {
    const comentarioRef = doc(db, "comments", comentarioId)
    await updateDoc(comentarioRef, {
      status: "accepted", // Mudei para "accepted" para manter consistência
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Erro ao aprovar comentário:", error)
    throw new Error("Falha ao aprovar comentário")
  }
}

// Action para rejeitar comentário
export async function rejeitarComentario(comentarioId: string): Promise<void> {
  try {
    const comentarioRef = doc(db, "comments", comentarioId)
    await updateDoc(comentarioRef, {
      status: "rejected", // Mudei para "rejected" para manter consistência
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Erro ao rejeitar comentário:", error)
    throw new Error("Falha ao rejeitar comentário")
  }
}