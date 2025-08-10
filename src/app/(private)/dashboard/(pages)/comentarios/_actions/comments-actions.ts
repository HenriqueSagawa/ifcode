"use server"

import { db } from "@/lib/firebase"
import { commentStatus } from "@/types/posts";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore"
import { adicionarPontosComentarioAprovado } from "./ranking-actions" // Import da nova action

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  userId: string;
  user?: User;
  status?: commentStatus;
  receivedUserId?: string; // ID do usuário que recebeu o comentário
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
  totalPoints?: number; // Adicionado para o sistema de pontos
  level?: number; // Adicionado para o sistema de levels
}

export interface CommentWithUser extends Comment {
  user: User;
  postId: string;
  status: commentStatus;
  type: 'received' | 'made';
  receivedUserId?: string;
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
    } as Comment & { postId: string, status?: string, receivedUserId?: string }))

    // 2. Buscar comentários FEITOS pelo usuário (em qualquer post)
    const comentariosFeitosQuery = query(
      collection(db, "comments"),
      where("userId", "==", authorUserId)
    )
    const comentariosFeitosSnapshot = await getDocs(comentariosFeitosQuery)
    const comentariosFeitos = comentariosFeitosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment & { postId: string, status?: string, receivedUserId?: string }))

    // 3. Combinar todos os comentários
    const todosComentarios = [
      ...comentariosRecebidos.map(c => ({ ...c, type: 'received' as const })),
      ...comentariosFeitos.map(c => ({ ...c, type: 'made' as const }))
    ]

    // 4. Remover duplicatas (caso o usuário comente no próprio post)
    const comentariosUnicos = todosComentarios.filter((comentario, index, self) => 
      self.findIndex(c => c.id === comentario.id) === index
    )

    // 5. Buscar informações dos usuários
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

    // 6. Combinar dados dos comentários com usuários
    const comentariosCompletos: CommentWithUser[] = comentariosUnicos.map(comentario => ({
      id: comentario.id,
      content: comentario.content,
      createdAt: comentario.createdAt,
      likes: comentario.likes,
      isLiked: comentario.isLiked,
      userId: comentario.userId,
      postId: comentario.postId,
      receivedUserId: comentario.receivedUserId,
      status: (comentario.status as "pending" | "accepted" | "rejected") || "pending",
      type: comentario.type,
      user: usuariosMap.get(comentario.userId) || {
        id: comentario.userId,
        name: "Usuário não encontrado",
        email: "email@exemplo.com"
      }
    }))

    // 7. Calcular estatísticas
    const stats: DashboardStats = {
      total: comentariosCompletos.length,
      pendentes: comentariosCompletos.filter(c => c.status === "pending").length,
      aprovados: comentariosCompletos.filter(c => c.status === "accepted").length,
      rejeitados: comentariosCompletos.filter(c => c.status === "rejected").length,
      recebidos: comentariosCompletos.filter(c => c.type === "received").length,
      feitos: comentariosCompletos.filter(c => c.type === "made").length
    }

    // 8. Ordenar por data (mais recentes primeiro)
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

// Action para aprovar comentário - ATUALIZADA COM SISTEMA DE PONTOS
export async function aprovarComentario(comentarioId: string, autorPostId?: string): Promise<void> {
  try {
    // 1. Buscar dados do comentário para obter o autor
    const comentarioRef = doc(db, "comments", comentarioId)
    const comentarioDoc = await getDoc(comentarioRef)
    
    if (!comentarioDoc.exists()) {
      throw new Error("Comentário não encontrado")
    }

    const comentarioData = comentarioDoc.data()
    const autorComentarioId = comentarioData.userId
    const receivedUserId = comentarioData.receivedUserId || autorPostId

    // 2. Atualizar status do comentário
    await updateDoc(comentarioRef, {
      status: "accepted",
      updatedAt: new Date().toISOString()
    })

    // 3. Adicionar pontos ao autor do comentário (se não for ele mesmo aprovando)
    if (autorComentarioId !== receivedUserId && receivedUserId) {
      await adicionarPontosComentarioAprovado(
        comentarioId, 
        autorComentarioId, // Quem recebe os pontos (autor do comentário)
        receivedUserId     // Quem concede os pontos (dono do post)
      )
    }

    console.log(`✅ Comentário ${comentarioId} aprovado com sucesso`)
    
  } catch (error) {
    console.error("Erro ao aprovar comentário:", error)
    throw new Error("Falha ao aprovar comentário")
  }
}

// Action para rejeitar comentário - SEM PONTOS
export async function rejeitarComentario(comentarioId: string): Promise<void> {
  try {
    const comentarioRef = doc(db, "comments", comentarioId)
    await updateDoc(comentarioRef, {
      status: "rejected",
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Erro ao rejeitar comentário:", error)
    throw new Error("Falha ao rejeitar comentário")
  }
}

// Nova function para buscar comentário com mais detalhes (se necessário)
export async function buscarComentarioPorId(comentarioId: string): Promise<CommentWithUser | null> {
  try {
    const comentarioRef = doc(db, "comments", comentarioId)
    const comentarioDoc = await getDoc(comentarioRef)
    
    if (!comentarioDoc.exists()) {
      return null
    }

    const comentarioData = comentarioDoc.data() as Comment & { postId: string, receivedUserId?: string }
    
    // Buscar dados do usuário
    const userRef = doc(db, "users", comentarioData.userId)
    const userDoc = await getDoc(userRef)
    
    const user: User = userDoc.exists() 
      ? { id: comentarioData.userId, ...userDoc.data() } as User
      : { 
          id: comentarioData.userId, 
          name: "Usuário não encontrado", 
          email: "email@exemplo.com" 
        }

    return {
      ...comentarioData,
      user,
      status: (comentarioData.status as commentStatus) || "pending",
      type: 'received'
    }
    
  } catch (error) {
    console.error("Erro ao buscar comentário:", error)
    return null
  }
}