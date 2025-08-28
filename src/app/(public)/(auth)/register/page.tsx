import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SignUpForm } from './_components/register-form'

export const metadata: Metadata = {
  title: 'Criar Conta | Sua Plataforma',
  description: 'Crie sua conta para começar a usar nossa plataforma. Registro rápido e seguro.',
  keywords: ['cadastro', 'registro', 'criar conta', 'signup'],
  openGraph: {
    title: 'Criar Conta | Sua Plataforma',
    description: 'Crie sua conta para começar a usar nossa plataforma',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default async function SignUpPage() {
  const session = await getServerSession(authOptions)
  
  // Se já estiver logado, redirecionar para a página principal
  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="w-full">
      <SignUpForm />
    </main>
  )
}