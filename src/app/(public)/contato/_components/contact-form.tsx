"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ContactFormFields from "./contact-form-fields"
import { Send } from "lucide-react"

export default function ContactForm() {
  return (
    <div className="scroll-animate">
      <Card className="bg-gray-900/30 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Send className="mr-3 h-6 w-6 text-green-500" />
            Envie uma mensagem
          </CardTitle>
          <p className="text-gray-400">
            Preencha o formulário abaixo e retornaremos o mais rápido possível.
          </p>
        </CardHeader>
        <CardContent>
          <ContactFormFields />
        </CardContent>
      </Card>
    </div>
  )
}
