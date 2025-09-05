import { Metadata } from "next"
import { ResetPasswordForm } from "./_components/reset-password-form"

export const metadata: Metadata = {
  title: "Redefinir senha | IFCode",
  description: "Redefina sua senha de forma segura",
}

export default function ResetPasswordPage() {
  return (
    <>
      <ResetPasswordForm />
    </>
  )
}
