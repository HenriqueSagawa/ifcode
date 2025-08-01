"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Mail, MessageSquare, Clock, MapPin, Github, Instagram } from "lucide-react"
import Link from "next/link"

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Envie um e-mail",
      description: "Mande uma mensagem a qualquer hora",
      value: "ifcodeprojeto@gmail.com",
      href: "mailto:ifcodeprojeto@gmail.com",
    },
    {
      icon: MessageSquare,
      title: "Converse com a IA",
      description: "Converse com nosso assistente de IA",
      value: "Disponível 24h por dia",
      href: "/chat",
    },
    {
      icon: Clock,
      title: "Tempo de resposta",
      description: "Normalmente respondemos em até",
      value: "24 horas",
      href: null,
    },
    {
      icon: MapPin,
      title: "Localização",
      description: "Estamos localizados em",
      value: "Assis Chateaubriand, PR",
      href: null,
    },
  ]

  const socialLinks = [
    { icon: Github, href: "https://github.com/IFcode-Assis", label: "GitHub" },
    { icon: Instagram, href: "https://www.instagram.com/ifcode.assis/", label: "Instagram" },
  ]

  return (
    <div className="space-y-8">
      {/* Métodos de contato */}
      <div className="scroll-animate">
        <h2 className="text-2xl font-bold mb-6">Outras formas de falar com a gente</h2>
        <div className="space-y-4">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            const content = (
              <Card
                key={index}
                className="bg-gray-900/30 border-gray-800 hover:border-green-500/30 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Icon className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{method.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{method.description}</p>
                      <p className="text-green-500 font-medium">{method.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )

            return method.href ? (
              <Link key={method.title} href={method.href}>
                {content}
              </Link>
            ) : (
              <div key={method.title}>{content}</div>
            )
          })}
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="scroll-animate">
        <h3 className="text-xl font-semibold mb-4">Nos acompanhe</h3>
        <div className="flex space-x-4">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <Link
                key={social.label}
                href={social.href}
                className="p-3 bg-gray-900/30 border border-gray-800 rounded-lg hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300 group"
              >
                <Icon className="h-6 w-6 text-gray-400 group-hover:text-green-500 transition-colors" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Ajuda rápida */}
      <div className="scroll-animate">
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-500 mb-2">Precisa de ajuda agora?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Use nosso assistente de IA para obter respostas imediatas sobre programação e desenvolvimento.
            </p>
            <Link
              href="/ai"
              className="inline-flex items-center text-green-500 hover:text-green-400 transition-colors text-sm font-medium"
            >
              Conversar com a IA
              <MessageSquare className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
