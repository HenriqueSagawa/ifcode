"use client"

import { HelpCircle, Mail, MessageSquare } from "lucide-react"

export default function ContactHero() {
  return (
    <section className="pt-32 pb-16 px-6 relative overflow-hidden">
      {/* Elementos de Fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 left-16 w-24 h-24 bg-green-400/15 rounded-full blur-xl animate-float"></div>

        {/* Padrão de Grade */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm text-green-400 mb-4">
            <HelpCircle className="h-4 w-4 text-green-500 mr-3" />
            Entre em contato
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-black dark:text-white">
          Adoraríamos
          <br />
          <span className="text-green-500">ouvir você</span>
        </h1>

        <p className="text-xl text-gray-400 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
          Tem alguma dúvida, sugestão ou só quer dizer um oi? Envie uma mensagem e responderemos o mais rápido possível.
        </p>

        <div className="flex items-center justify-center gap-8 mt-12">
          <div className="flex items-center text-gray-400 dark:text-gray-400">
            <Mail className="h-5 w-5 mr-2 text-green-500" />
            <span className="text-sm">Respondemos geralmente em até 24h</span>
          </div>
          <div className="flex items-center text-gray-400 dark:text-gray-400">
            <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
            <span className="text-sm">Atendimento 24/7</span>
          </div>
        </div>
      </div>
    </section>
  )
}