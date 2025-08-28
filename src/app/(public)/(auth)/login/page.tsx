import { Metadata } from "next"
import { SignInForm } from "./_components/login-content"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Login | Sua Plataforma",
    description: "Faça login em sua conta para acessar a plataforma",
}

export default async function LoginPage() {
    const session = await getServerSession(authOptions)

    if (session) {
        return redirect("/dashboard")   
    }

    return (
        <>
            <SignInForm />
        </>
    )
}