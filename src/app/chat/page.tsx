import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import { DinamicMessage } from "@/components/Chatbot/DinamicMessage";
import { PromptInput } from "@/components/Chatbot/PromptInput";

export default function ChatbotPage() {
  return (
    <div className="flex flex-col bg-black text-white min-h-[calc(100vh-5rem)] max-w-screen-xl mx-auto overflow-hidden">
      {/* Header */}
      <header className="p-3 flex items-center sticky top-0 z-10 bg-black/80 backdrop-blur-sm">
        <Button variant="outline" size="icon" className="mr-2 border-gray-800 text-white">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:p-6 max-w-3xl mx-auto w-full overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <DinamicMessage />
        </div>

        {/* Description */}
        <div className="text-center mb-6 text-gray-300 space-y-2 px-2 sm:px-4">
          <p className="text-sm sm:text-base">
            Aqui você pode tirar dúvidas sobre programação, compartilhar conhecimento e interagir com a comunidade.
            Nosso chatbot foi desenvolvido para oferecer suporte rápido e eficiente aos estudantes de informática.
          </p>
        </div>

        {/* Example prompts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full mt-4 sm:mt-8">
          <Card className="bg-gray-900 border-gray-800 p-3 sm:p-4 hover:bg-gray-800 transition-colors cursor-pointer">
            <p className="text-gray-300 text-sm sm:text-base">Quais são as vantagens</p>
            <p className="text-gray-500 text-sm sm:text-base">de usar Next.js?</p>
          </Card>
          <Card className="bg-gray-900 border-gray-800 p-3 sm:p-4 hover:bg-gray-800 transition-colors cursor-pointer">
            <p className="text-gray-300 text-sm sm:text-base">Me ajuda a escrever</p>
            <p className="text-gray-500 text-sm sm:text-base">um algoritmo para calcular o IMC</p>
          </Card>
          <Card className="bg-gray-900 border-gray-800 p-3 sm:p-4 hover:bg-gray-800 transition-colors cursor-pointer">
            <p className="text-gray-300 text-sm sm:text-base">Eu não consigo entender</p>
            <p className="text-gray-500 text-sm sm:text-base">esse código em Python</p>
          </Card>
          <Card className="bg-gray-900 border-gray-800 p-3 sm:p-4 hover:bg-gray-800 transition-colors cursor-pointer">
            <p className="text-gray-300 text-sm sm:text-base">O que é um</p>
            <p className="text-gray-500 text-sm sm:text-base">loop for na programação?</p>
          </Card>
        </div>
      </main>

      {/* Input area - fixed at bottom */}
      <div className="sticky bottom-0 w-full bg-black/90 backdrop-blur-sm pt-2 pb-4">
        <PromptInput />
      </div>
    </div>
  )
}