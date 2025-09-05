import { NextRequest, NextResponse } from "next/server"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Token é obrigatório" },
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

    return NextResponse.json(
      { 
        message: "Token válido",
        email: tokenData.email 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Erro na verificação do token:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
