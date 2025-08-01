"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export default function ContactFAQ() {
  const faqs = [
    {
      question: "Com que rapidez vocês respondem às mensagens?",
      answer:
        "Normalmente respondemos todas as mensagens em até 24 horas em dias úteis. Para problemas técnicos urgentes, buscamos responder em 4 a 6 horas.",
    },
    {
      question: "Posso receber ajuda direta com meu código?",
      answer:
        "Sim! Você pode postar suas dúvidas no nosso fórum da comunidade ou conversar com nosso assistente de IA para obter ajuda imediata. Para casos mais complexos, nossa equipe pode oferecer suporte personalizado.",
    },
    {
      question: "O suporte técnico é gratuito?",
      answer:
        "O suporte comunitário básico é totalmente gratuito. Nosso assistente de IA e os fóruns da comunidade estão disponíveis 24 horas por dia sem custo. Oferecemos suporte premium para empresas.",
    },
    {
      question: "Como posso reportar um bug ou sugerir uma funcionalidade?",
      answer:
        "Você pode relatar bugs ou sugerir melhorias através do nosso formulário de contato, escolhendo a categoria adequada, ou criando uma issue no nosso repositório no GitHub.",
    },
    {
      question: "Existe uma forma de obter ajuda imediata?",
      answer:
        "Sim! Nosso assistente de IA está disponível 24/7 para responder dúvidas sobre programação. Você também pode consultar o fórum da comunidade para soluções já discutidas.",
    },
  ]

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 scroll-animate">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm text-green-400 mb-4">
            <i className="ri-question-mark text-lg"></i>
            Perguntas em Destaque
          </div>
          <p className="text-gray-400 text-lg">
            Respostas rápidas para as dúvidas mais comuns. Não encontrou o que procurava? Envie uma mensagem para a gente.
          </p>
        </div>

        <Card className="bg-gray-900/30 border-gray-800 scroll-animate">
          <CardContent className="p-8">
            <Accordion type="single" collapsible className="flex flex-col gap-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-gray-800 hover:border-green-500/30 transition-colors"
                >
                  <AccordionTrigger className="text-left text-white hover:text-green-500 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
