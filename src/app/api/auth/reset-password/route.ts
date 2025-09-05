import { NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token e senha são obrigatórios" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Buscar token no Firestore
    const resetTokensRef = doc(db, "resetTokens", token)
    const tokenDoc = await getDoc(resetTokensRef)

    if (!tokenDoc.exists()) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      )
    }

    const tokenData = tokenDoc.data()

    // Verificar se o token foi usado
    if (tokenData.used) {
      return NextResponse.json(
        { error: "Token já foi usado" },
        { status: 400 }
      )
    }

    // Verificar se o token expirou
    const now = new Date()
    const expiresAt = tokenData.expiresAt.toDate()

    if (now > expiresAt) {
      return NextResponse.json(
        { error: "Token expirado" },
        { status: 400 }
      )
    }

    // Buscar usuário
    const userRef = doc(db, "users", tokenData.userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    // Criptografar nova senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Atualizar senha do usuário
    await updateDoc(userRef, {
      password: hashedPassword,
      updatedAt: new Date(),
    })

    // Marcar token como usado
    await updateDoc(resetTokensRef, {
      used: true,
      usedAt: new Date(),
    })

    return NextResponse.json(
      { message: "Senha redefinida com sucesso" },
      { status: 200 }
    )

  } catch (error) {
    console.error("Erro no reset-password:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
