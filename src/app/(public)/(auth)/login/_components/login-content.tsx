"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Github, Mail, Lock, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { addToast } from "@heroui/toast"
import { Separator } from "@/components/ui/separator"

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
})

type SignInFormData = z.infer<typeof signInSchema>

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        addToast({
          title: "Erro ao fazer login",
          description: result.error,
          color: "danger",
        })
      } else if (result?.ok) {
        addToast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
          color: "default",
        })
        
        setTimeout(() => {
          router.push(callbackUrl)
        }, 1000)
      }
    } catch (error) {
      addToast({
        title: "Erro interno",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        color: "danger",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialLoading(provider)
    
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      addToast({
        title: "Erro no login social",
        description: "Não foi possível conectar com o provedor selecionado.",
        color: "danger",
      })
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-black dark:via-gray-900 dark:to-emerald-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-emerald-200 dark:border-emerald-500/20 bg-white/95 dark:bg-black/80 backdrop-blur-sm shadow-xl dark:shadow-2xl">
          <CardHeader className="space-y-4 pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-emerald-50">
                Entrar
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-center">
                Entre com sua conta para continuar
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialSignIn("google")}
                disabled={socialLoading !== null}
                className="relative border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-200 bg-white dark:bg-transparent"
              >
                {socialLoading === "google" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-700 dark:text-gray-300">Google</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSocialSignIn("github")}
                disabled={socialLoading !== null}
                className="relative border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-200 bg-white dark:bg-transparent"
              >
                {socialLoading === "github" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Github className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
                    <span className="text-gray-700 dark:text-gray-300">GitHub</span>
                  </>
                )}
              </Button>
            </div>

            <div className="relative">
              <Separator className="bg-gray-300 dark:bg-gray-700" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black px-2 text-sm text-gray-500">
                ou continue com email
              </span>
            </div>

            {/* Email/Password Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-emerald-50">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-10 border-emerald-300 dark:border-emerald-500/30 focus:border-emerald-500 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-emerald-50 placeholder:text-gray-500"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-600 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-emerald-50">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 border-emerald-300 dark:border-emerald-500/30 focus:border-emerald-500 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-emerald-50 placeholder:text-gray-500"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-600 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold transition-all duration-200 group shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Sign up link */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                Não tem uma conta?{" "}
                <Link
                  href="/register"
                  className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 font-medium transition-colors"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}