import { NextRequest, NextResponse } from "next/server"
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import crypto from "crypto"
import { emailService } from "@/services/email.service"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()

    // Verificar se o usuário tem senha (foi criado via credentials)
    if (!userData.password) {
      return NextResponse.json(
        { error: "Esta conta foi criada com login social. Use Google ou GitHub para entrar." },
        { status: 400 }
      )
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    // Salvar token no Firestore
    const resetTokensRef = collection(db, "resetTokens")
    await setDoc(doc(resetTokensRef, resetToken), {
      userId: userDoc.id,
      email: email,
      expiresAt: resetTokenExpiry,
      used: false,
      createdAt: new Date(),
    })

    // Enviar email de recuperação
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
    
    try {
      const emailSent = await emailService.sendPasswordResetEmail(
        email,
        userData.name || "Usuário",
        resetUrl
      )
      
      if (!emailSent) {
        console.error("Falha ao enviar email de recuperação")
        // Não falhar a requisição se o email não for enviado
        // O token ainda é válido e pode ser usado
      }
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError)
      // Não falhar a requisição se o email não for enviado
      // O token ainda é válido e pode ser usado
    }

    return NextResponse.json(
      { message: "Email de recuperação enviado com sucesso" },
      { status: 200 }
    )

  } catch (error) {
    console.error("Erro no forgot-password:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
