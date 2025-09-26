"use server"

import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { revalidatePath } from "next/cache"

export async function unarchivePost(postId: string) {
  try {
    if (!postId) {
      throw new Error("ID do post é obrigatório")
    }

    if (!db) {
      throw new Error("Erro de configuração do Firebase")
    }

    const postRef = doc(db, "posts", postId)
    
    await updateDoc(postRef, {
      status: "published",
      updatedAt: new Date().toISOString().split("T")[0]
    })
    
    revalidatePath("/dashboard/publicacoes")
    revalidatePath(`/dashboard/publicacoes/${postId}`)
    
    return { success: true, message: "Post desarquivado com sucesso!" }

  } catch (error) {
    console.error("❌ Erro ao desarquivar post:", error)
    return { 
      success: false, 
      message: "Erro ao desarquivar post. Tente novamente." 
    }
  }
}
