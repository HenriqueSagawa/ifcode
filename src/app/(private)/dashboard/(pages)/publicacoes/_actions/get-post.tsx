"use server"

import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import type { PostProps } from "@/types/posts"

export async function getPostById(postId: string): Promise<PostProps | null> {
  try {
    if (!postId) {
      console.error("❌ ID do post não fornecido")
      throw new Error("ID do post é obrigatório")
    }

    if (!db) {
      console.error("❌ Firebase não está configurado corretamente")
      throw new Error("Erro de configuração do Firebase")
    }

    const postRef = doc(db, "posts", postId)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      console.error("❌ Post não encontrado")
      return null
    }

    const data = postSnap.data()
    
    return {
      id: postSnap.id,
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

  } catch (error) {
    console.error("❌ Erro ao buscar post:", error)
    console.error("Stack trace:", (error as Error).stack)
    return null
  }
}
