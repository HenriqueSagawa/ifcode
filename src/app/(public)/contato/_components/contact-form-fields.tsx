"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Send, CheckCircle } from "lucide-react"
import emailjs from "@emailjs/browser"
export default function ContactFormFields() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await emailjs.send(
        "service_mkpz7zs",
        "template_p62l33e",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          category: formData.category,
          message: formData.message,
        },
        "7ZehpHGHmuYj1a0Wn",
      )

      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      })
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error)
      alert("Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-20 h-20 mx-auto mb-4 text-green-500 animate-draw"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeDasharray="62.8"
            strokeDashoffset="62.8"
          />
          <path
            d="M9 12l2 2 4-4"
            strokeDasharray="12"
            strokeDashoffset="12"
          />
        </svg>

        <h3 className="text-xl font-semibold text-white mb-2">Mensagem enviada com sucesso!</h3>
        <p className="text-gray-400">Entraremos em contato assim que possível.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Nome *
          </Label>
          <Input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
            placeholder="Seu nome completo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            E-mail *
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
            placeholder="seu.email@exemplo.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-white">
            Categoria
          </Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white focus:border-green-500 focus:ring-green-500">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="general">Dúvida Geral</SelectItem>
              <SelectItem value="technical">Suporte Técnico</SelectItem>
              <SelectItem value="feature">Sugestão de Funcionalidade</SelectItem>
              <SelectItem value="bug">Relatar Bug</SelectItem>
              <SelectItem value="partnership">Parcerias</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-white">
            Assunto *
          </Label>
          <Input
            id="subject"
            type="text"
            required
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
            placeholder="Resumo da sua mensagem"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-white">
          Mensagem *
        </Label>
        <Textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500 resize-none"
          placeholder="Conte mais detalhes sobre sua dúvida ou sugestão..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-3 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
            Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Enviar mensagem
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Ao enviar este formulário, você concorda com nossa política de privacidade e termos de uso.
      </p>
    </form>
  )
}
