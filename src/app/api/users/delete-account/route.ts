import { NextResponse } from "next/server"
import { db } from "@/services/firebaseConnection"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
  limit,
} from "firebase/firestore"

async function deleteByField(collectionName: string, field: string, value: string) {
  // Deleta em lotes para evitar limites
  // Usa where(field, '==', value)
  while (true) {
    const q = query(collection(db, collectionName), where(field, "==", value), limit(300))
    const snapshot = await getDocs(q)
    if (snapshot.empty) break

    const batch = writeBatch(db)
    snapshot.forEach((d) => {
      batch.delete(doc(db, collectionName, d.id))
    })
    await batch.commit()
    if (snapshot.size < 300) break
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    // Garantir que o email informado corresponde ao do usuário autenticado
    if (email.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json({ error: "Email não confere com a conta atual" }, { status: 403 })
    }

    const userId = session.user.id

    // Apagar dados relacionados em coleções conhecidas
    const tasks: Promise<any>[] = []
    // posts do usuário
    tasks.push(deleteByField("posts", "userId", userId))
    // comentários do usuário
    tasks.push(deleteByField("comments", "userId", userId))
    // likes do usuário
    tasks.push(deleteByField("likes", "userId", userId))
    // histórico de chat do usuário
    tasks.push(deleteByField("chatHistory", "userId", userId))
    // ranking
    tasks.push(deleteByField("ranking", "userId", userId))
    // reports feitos pelo usuário
    tasks.push(deleteByField("reports", "reporterId", userId))
    // notificações (há usos de 'notification' e 'notifications')
    tasks.push(deleteByField("notification", "userId", userId))
    tasks.push(deleteByField("notifications", "userId", userId))
    tasks.push(deleteByField("notifications", "recipientId", userId))
    // tokens de reset
    tasks.push(deleteByField("resetTokens", "userId", userId))

    await Promise.all(tasks)

    // Por fim, apagar o documento do usuário
    await deleteDoc(doc(db, "users", userId))

    return NextResponse.json({ message: "Conta e dados excluídos com sucesso" })
  } catch (error: any) {
    console.error("Erro ao excluir conta:", error)
    return NextResponse.json({ error: "Erro ao excluir conta" }, { status: 500 })
  }
}


