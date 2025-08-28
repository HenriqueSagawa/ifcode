"use server"

import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import bcrypt from "bcryptjs"
import { signIn } from "next-auth/react"
import { redirect } from "next/navigation"
import { z } from "zod"

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número"),
})

interface ActionResult {
  success: boolean
  message: string
  userId?: string
}

export async function registerUser(prevState: any, formData: FormData): Promise<ActionResult> {
  try {
    const validatedFields = registerSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: validatedFields.error.errors[0]?.message || "Dados inválidos"
      }
    }

    const { name, email, password } = validatedFields.data

    // Verificar se o usuário já existe
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: "Usuário já existe com este email"
      }
    }

    // Hash da senha
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Criar usuário no Firestore
    const newUser = {
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      createdAt: new Date(),
      bio: null,
      birthDate: null,
      github: null,
      phone: null,
      image: null,
      bannerImage: null,
      skills: [],
      totalPoints: 0,
    }

    const docRef = await addDoc(usersRef, newUser)

    return {
      success: true,
      message: "Usuário criado com sucesso",
      userId: docRef.id
    }

  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return {
      success: false,
      message: "Erro interno do servidor"
    }
  }
}

export async function registerAndLogin(prevState: any, formData: FormData): Promise<ActionResult> {
  const registerResult = await registerUser(prevState, formData)
  
  if (!registerResult.success) {
    return registerResult
  }

  return {
    success: true,
    message: "Conta criada com sucesso! Fazendo login...",
    userId: registerResult.userId
  }
}