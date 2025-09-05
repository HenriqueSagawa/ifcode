import { Metadata } from "next"
import { ForgotPasswordForm } from "./_components/forgot-password-form"

export const metadata: Metadata = {
  title: "Esqueceu a senha? | IFCode",
  description: "Recupere sua senha de forma segura",
}

export default function ForgotPasswordPage() {
  return (
    <>
      <ForgotPasswordForm />
    </>
  )
}
