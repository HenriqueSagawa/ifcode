"use client"

import { useState, useEffect, useTransition } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Github, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { addToast } from "@heroui/toast"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { registerAndLogin } from "../_actions/auth"

const signUpSchema = z.object({
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
  confirmPassword: z
    .string()
    .min(1, "Confirmação de senha é obrigatória"),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, "Você deve aceitar os termos de uso")
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})

type SignUpFormData = z.infer<typeof signUpSchema>

const passwordRequirements = [
  { regex: /^.{8,}$/, text: "Pelo menos 8 caracteres" },
  { regex: /[a-z]/, text: "Uma letra minúscula" },
  { regex: /[A-Z]/, text: "Uma letra maiúscula" },
  { regex: /\d/, text: "Um número" },
]

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // State para server actions usando useTransition
  const [isPending, startTransition] = useTransition()
  const [actionState, setActionState] = useState<{
    success: boolean
    message: string
  }>({
    success: false,
    message: ""
  })

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  const watchedPassword = form.watch("password")

  // Effect para lidar com o resultado do server action
  useEffect(() => {
    if (actionState.success && actionState.message) {
      addToast({
        title: "Sucesso!",
        description: actionState.message,
        color: "success",
      })

      // Fazer login automático após cadastro
      const email = form.getValues("email")
      const password = form.getValues("password")
      
      signIn("credentials", {
        email,
        password,
        redirect: false,
      }).then((result) => {
        if (result?.ok) {
          setTimeout(() => {
            router.push("/dashboard/")
          }, 1000)
        } else {
          addToast({
            title: "Conta criada!",
            description: "Por favor, faça login com suas credenciais.",
            color: "default",
          })
          router.push("/login")
        }
      })
    } else if (!actionState.success && actionState.message) {
      addToast({
        title: "Erro ao criar conta",
        description: actionState.message,
        color: "danger",
      })
    }
    setIsSubmitting(false)
  }, [actionState, form, router])

  const onSubmit = async (data: SignUpFormData) => {
    if (!data.acceptTerms) {
      addToast({
        title: "Termos não aceitos",
        description: "Você deve aceitar os termos de uso para continuar.",
        color: "danger",
      })
      return
    }

    setIsSubmitting(true)
    
    // Usar useTransition para executar server action
    startTransition(async () => {
      try {
        // Criar FormData para o server action
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('password', data.password)
        
        // Executar server action
        const result = await registerAndLogin({
          success: false,
          message: ""
        }, formData)
        
        setActionState(result)
      } catch (error) {
        setActionState({
          success: false,
          message: "Erro ao processar solicitação. Tente novamente."
        })
      }
    })
  }

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialLoading(provider)
    
    try {
      await signIn(provider, { callbackUrl: "/" })
    } catch (error) {
      addToast({
        title: "Erro no cadastro social",
        description: "Não foi possível conectar com o provedor selecionado.",
        color: "danger",
      })
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border-2 border-emerald-500/20 bg-black/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-black" />
              </div>
              <CardTitle className="text-2xl font-bold text-emerald-50">
                Criar Conta
              </CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Crie sua conta para começar a usar a plataforma
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialSignIn("google")}
                disabled={socialLoading !== null || isSubmitting || isPending}
                className="relative border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200"
              >
                {socialLoading === "google" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Google
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSocialSignIn("github")}
                disabled={socialLoading !== null || isSubmitting || isPending}
                className="relative border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200"
              >
                {socialLoading === "github" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </>
                )}
              </Button>
            </div>

            <div className="relative">
              <Separator className="bg-gray-700" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2 text-sm text-gray-500">
                ou crie com email
              </span>
            </div>

            {/* Registration Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-50">Nome Completo</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            {...field}
                            type="text"
                            placeholder="Seu nome completo"
                            className="pl-10 border-emerald-500/30 focus:border-emerald-500 bg-gray-900/50 text-emerald-50 placeholder:text-gray-500"
                            disabled={isSubmitting || isPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-50">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-10 border-emerald-500/30 focus:border-emerald-500 bg-gray-900/50 text-emerald-50 placeholder:text-gray-500"
                            disabled={isSubmitting || isPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-50">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 border-emerald-500/30 focus:border-emerald-500 bg-gray-900/50 text-emerald-50 placeholder:text-gray-500"
                            disabled={isSubmitting || isPending}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isSubmitting || isPending}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      
                      {/* Password Requirements */}
                      {watchedPassword && (
                        <div className="mt-2 space-y-1">
                          {passwordRequirements.map((req, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center space-x-2 text-xs"
                            >
                              {req.regex.test(watchedPassword) ? (
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <div className="w-3 h-3 rounded-full border border-gray-500" />
                              )}
                              <span className={req.regex.test(watchedPassword) ? "text-emerald-500" : "text-gray-500"}>
                                {req.text}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-50">Confirmar Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 border-emerald-500/30 focus:border-emerald-500 bg-gray-900/50 text-emerald-50 placeholder:text-gray-500"
                            disabled={isSubmitting || isPending}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isSubmitting || isPending}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-emerald-500/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-gray-300">
                          Aceito os{" "}
                          <Link href="/terms" className="text-emerald-500 hover:text-emerald-400 underline">
                            termos de uso
                          </Link>{" "}
                          e{" "}
                          <Link href="/privacy" className="text-emerald-500 hover:text-emerald-400 underline">
                            política de privacidade
                          </Link>
                        </FormLabel>
                        <FormMessage className="text-red-400" />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-semibold transition-all duration-200 group"
                                              disabled={isSubmitting || isPending}
                >
                  {(isSubmitting || isPending) ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Criar Conta
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Sign in link */}
            <div className="text-center pt-4 border-t border-gray-800">
              <p className="text-gray-400">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}