'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import { DinamicMessage } from "@/components/Chatbot/DinamicMessage";
import { PromptInput } from "@/components/Chatbot/PromptInput";
import { Message } from "@/components/Chatbot/Message";
import { ChatMessage } from "@/services/gemini/chat.service";
import { LoadingMessage } from '@/components/Chatbot/LoadingMessage';
import { useSession } from 'next-auth/react';
import { addToast } from "@heroui/toast"
import { ChatService } from '@/services/gemini/chat.service';

const chatService = ChatService.getInstance();

const exampleCards = [
  {
      title: "Quais são as vantagens",
      subtitle: "de usar Next.js?"
  },
  {
      title: "Me ajuda a escrever",
      subtitle: "um algoritmo para calcular o IMC"
  },
  {
      title: "Eu não consigo entender",
      subtitle: "esse código em Python"
  },
  {
      title: "O que é um",
      subtitle: "loop for na programação?"
  }
]

export default function ChatbotPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        try {
            setIsLoading(true);
            
            // Adiciona a mensagem do usuário
            const userMessage: ChatMessage = { role: "user", content: message };
            setMessages(prev => [...prev, userMessage]);

            // Obtém a resposta do bot
            const response = await chatService.sendMessage([...messages, userMessage]);
            
            // Adiciona a resposta do bot
            const botMessage: ChatMessage = { role: "model", content: response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            addToast({
                title: "Erro",
                description: "Não foi possível enviar a mensagem. Tente novamente.",
                color: "foreground",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] bg-background text-foreground max-w-screen-xl mx-auto">
            {/* Header */}
            <header className="p-3 flex items-center bg-background/80 backdrop-blur-sm">
                <Button variant="outline" size="icon" className="mr-2">
                    <PlusIcon className="h-4 w-4" />
                </Button>
            </header>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto px-4 py-2 sm:p-6 max-w-3xl mx-auto w-full">
                    {/* Messages */}
                    <div className="w-full space-y-4 mb-4">
                        {messages.map((message, index) => (
                            <Message key={index} message={message} />
                        ))}
                        {isLoading && <LoadingMessage />}
                    </div>

                    {/* Logo */}
                    {messages.length === 0 && (
                        <div className="flex items-center justify-center mb-4">
                            <DinamicMessage />
                        </div>
                    )}

                    {/* Description */}
                    {messages.length === 0 && (
                        <div className="text-center mb-6 text-muted-foreground space-y-2 px-2 sm:px-4">
                            <p className="text-sm sm:text-base">
                                Aqui você pode tirar dúvidas sobre programação, compartilhar conhecimento e interagir com a comunidade.
                                Nosso chatbot foi desenvolvido para oferecer suporte rápido e eficiente aos estudantes de informática.
                            </p>
                        </div>
                    )}

                    {/* Example prompts */}
                    {messages.length === 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full mt-4 sm:mt-8">
                            {exampleCards.map((prompt, index) => (
                                <Card 
                                    key={index}
                                    className="bg-muted transition-all hover:bg-muted/80 cursor-pointer p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md border border-border/50 hover:scale-105 hover:border-primary/50 group relative overflow-hidden"
                                >
                                    <div className="space-y-1 z-10 relative">
                                        <p className="text-foreground font-medium text-sm sm:text-base transition-colors">{prompt.title}</p>
                                        <p className="text-muted-foreground text-sm sm:text-base">{prompt.subtitle}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-full group-hover:translate-x-0"></div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input area - fixed at bottom */}
                <div className="w-full bg-background/90 backdrop-blur-sm pt-2 pb-4">
                    <PromptInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}