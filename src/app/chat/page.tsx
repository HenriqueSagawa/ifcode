import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PaperclipIcon, ArrowUpIcon, PlusIcon, ChevronDownIcon } from "lucide-react"
import Link from "next/link";
import { DinamicMessage } from "@/components/Chatbot/DinamicMessage"

export default function ChatbotPage() {
  return (
    <div className="flex flex-col bg-black text-white max-w-screen-xl mx-auto h-[calc(100vh-4rem)] overflow-y-hidden">
      {/* Header */}
      <header className="p-3 flex items-center">
        <Button variant="outline" size="icon" className="mr-2 border-gray-800 text-white">
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="text-sm font-normal flex items-center gap-2 border-gray-800 text-white">
          Modelo de Chat
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </header>

      {/* Main content - added overflow-y-auto to enable scrolling within this section if needed */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <DinamicMessage />
        </div>

        {/* Description */}
        <div className="text-center mb-8 text-gray-300 space-y-2">
          Aqui você pode tirar dúvidas sobre programação, compartilhar conhecimento e interagir com a comunidade.
          Nosso chatbot foi desenvolvido para oferecer suporte rápido e eficiente aos estudantes de informática.
        </div>

        {/* Example prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-8">
          <Card className="bg-gray-900 border-gray-800 p-4 hover:bg-gray-800 transition-colors cursor-pointer">
            <p className="text-gray-300">Quais são as vantagens</p>
            <p className="text-gray-500">de usar Next.js?</p>
          </Card>
          <Card className="bg-gray-900 border-gray-800 p-4 hover:bg-gray-800 transition-colors cursor-pointer">
            <p className="text-gray-300">Me ajuda a escrever</p>
            <p className="text-gray-500">um algoritmo para calcular o IMC</p>
          </Card>
          <Card className="bg-gray-900 border-gray-800 p-4 hover:bg-gray-800 transition-colors cursor-pointer">
            <p className="text-gray-300">Eu não consigo entender</p>
            <p className="text-gray-500">esse código em Python</p>
          </Card>
          <Card className="bg-gray-900 border-gray-800 p-4 hover:bg-gray-800 transition-colors cursor-pointer">
            <p className="text-gray-300">O que é um</p>
            <p className="text-gray-500">loop for na programação?</p>
          </Card>
        </div>
      </main>

      {/* Input area */}
      <div className="p-4 pb-6 max-w-3xl mx-auto w-full mb-4">
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 transition-all duration-300 hover:border-gray-700 focus-within:border-gray-600 focus-within:shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          <Input
            placeholder="Digite sua mensagem..."
            className="bg-transparent border-0 pr-12 pl-12 py-7 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-full transition-colors"
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-gray-700 text-white hover:bg-gray-600 rounded-full transition-all duration-200 hover:scale-105"
            >
              <ArrowUpIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}