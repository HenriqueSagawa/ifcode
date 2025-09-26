"use server"

import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { revalidatePath } from "next/cache"

export async function deletePost(postId: string) {
  try {
    if (!postId) {
      throw new Error("ID do post é obrigatório")
    }

    if (!db) {
      throw new Error("Erro de configuração do Firebase")
    }

    const postRef = doc(db, "posts", postId)
    
    // Não deletamos do banco, apenas mudamos o status para deleted
    await updateDoc(postRef, {
      status: "deleted",
      updatedAt: new Date().toISOString().split("T")[0]
    })
    
    revalidatePath("/dashboard/publicacoes")
    revalidatePath(`/dashboard/publicacoes/${postId}`)
    
    return { success: true, message: "Post deletado com sucesso!" }

  } catch (error) {
    console.error("❌ Erro ao deletar post:", error)
    return { 
      success: false, 
      message: "Erro ao deletar post. Tente novamente." 
    }
  }
}
