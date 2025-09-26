"use server"

import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { revalidatePath } from "next/cache"

interface UpdatePostData {
  title?: string
  content?: string
  type?: "article" | "question" | "project" | "tutorial" | "discussion"
  programmingLanguage?: string
  codeSnippet?: string
  imagesUrls?: string[]
}

export async function updatePost(postId: string, data: UpdatePostData) {
  try {
    if (!postId) {
      throw new Error("ID do post é obrigatório")
    }

    if (!db) {
      throw new Error("Erro de configuração do Firebase")
    }

    const postRef = doc(db, "posts", postId)
    
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString().split("T")[0]
    }

    await updateDoc(postRef, updateData)
    
    revalidatePath("/dashboard/publicacoes")
    revalidatePath(`/dashboard/publicacoes/${postId}`)
    
    return { success: true, message: "Post atualizado com sucesso!" }

  } catch (error) {
    console.error("❌ Erro ao atualizar post:", error)
    return { 
      success: false, 
      message: "Erro ao atualizar post. Tente novamente." 
    }
  }
}
