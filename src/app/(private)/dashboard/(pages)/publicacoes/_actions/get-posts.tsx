"use server"

import { db } from "@/lib/firebase" // Ajuste o caminho conforme sua configuração
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import type { PostProps } from "@/types/posts"

export async function getUserPosts(userId: string): Promise<PostProps[]> {
  try {
    
    if (!userId) {
      console.error("❌ ID do usuário não fornecido")
      throw new Error("ID do usuário é obrigatório")
    }

    if (!db) {
      console.error("❌ Firebase não está configurado corretamente")
      throw new Error("Erro de configuração do Firebase")
    }

    
    const postsRef = collection(db, "posts")
    
    const simpleQuery = query(postsRef, where("userId", "==", userId))
    
    try {
      const querySnapshot = await getDocs(simpleQuery)
      
      const posts: PostProps[] = querySnapshot.docs
        .map((doc) => {
          const data = doc.data()
          
          return {
            id: doc.id,
            title: data.title || "",
            content: data.content || "",
            createdAt: data.createdAt || new Date().toISOString().split("T")[0],
            updatedAt: data.updatedAt || new Date().toISOString().split("T")[0],
            type: data.type || "article",
            programmingLanguage: data.programmingLanguage || "unknown",
            codeSnippet: data.codeSnippet || "",
            imagesUrls: data.imagesUrls || [],
            likes: data.likes || 0,
            userId: data.userId || "",
            status: data.status || "published"
          } as PostProps
        })
        .filter(post => post.status !== "deleted") // Filtrar apenas posts não deletados

      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      return posts
      
    } catch (queryError) {
      console.error("❌ Erro na query do Firestore:", queryError)
      
      const fallbackQuery = query(postsRef, where("userId", "==", userId))
      const fallbackSnapshot = await getDocs(fallbackQuery)
      
      const posts: PostProps[] = fallbackSnapshot.docs
        .map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title || "",
            content: data.content || "",
            createdAt: data.createdAt || new Date().toISOString().split("T")[0],
            updatedAt: data.updatedAt || new Date().toISOString().split("T")[0],
            type: data.type || "article",
            programmingLanguage: data.programmingLanguage || "unknown",
            codeSnippet: data.codeSnippet || "",
            imagesUrls: data.imagesUrls || [],
            likes: data.likes || 0,
            userId: data.userId || "",
            status: data.status || "published"
          } as PostProps
        })
        .filter(post => post.status !== "deleted") // Filtrar apenas posts não deletados
      
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      return posts
    }
    
  } catch (error) {
    console.error("❌ Erro geral ao buscar posts do usuário:", error)
    console.error("Stack trace:", (error as Error).stack)
    
    return []
  }
}