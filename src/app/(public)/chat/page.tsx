'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Button as ButtonHeroUi } from "@heroui/button";
import { Card } from "@/components/ui/card"
import { PlusIcon, History } from "lucide-react"
import { DinamicMessage } from "@/components/Chatbot/DinamicMessage";
import { PromptInput } from "@/components/Chatbot/PromptInput";
import { Message } from "@/components/Chatbot/Message";
import { ChatMessage } from "@/services/gemini/chat.service";
import { LoadingMessage } from '@/components/Chatbot/LoadingMessage';
import { useSession } from 'next-auth/react';
import { addToast } from "@heroui/toast"
import { ChatService } from '@/services/gemini/chat.service';
import { cn } from "@heroui/theme";
import Link from "next/link";
import { UserData } from "@/types/userData";
import { BackButton } from "@/components/BackButton";
import { ChatHistoryModal } from "@/components/ChatHistoryModal";
import { ChatHistoryService } from "@/services/chatHistoryService";
import { ChatMessage as ChatHistoryMessage } from "@/types/chatHistory";

const chatService = ChatService.getInstance();
const chatHistoryService = ChatHistoryService.getInstance();

const exampleCards = [
    {
        title: "Quais são as vantagens",
        subtitle: "de usar Next.js?",
        message: "Quais são as vantagens de usar Next.js?"
    },
    {
        title: "Me ajuda a escrever",
        subtitle: "um algoritmo para calcular o IMC",
        message: "Me ajuda a escrever um algoritmo para calcular o IMC"
    },
    {
        title: "Eu não consigo entender",
        subtitle: "esse código em Python",
        message: "Eu não consigo entender esse código em Python"
    },
    {
        title: "O que é um",
        subtitle: "loop for na programação?",
        message: "O que é um loop for na programação?"
    }
]

export default function ChatbotPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<UserData>()
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

    const dataFetch = useRef(false);

    useEffect(() => {
        async function fetchUser() {
            if (dataFetch.current) return;
            if (session) {
                try {
                    const response = await fetch(`/api/users/getUser?email=${session.user?.email}`);
                    const data = await response.json();
                    if (data.error) {
                        console.error("Erro ao buscar usuário:", data.error);
                    } else {
                        console.log("Usuário:", data.user);
                        setUser(data.user);
                        dataFetch.current = true;

                    }
                } catch (error) {
                    console.error("Erro ao buscar usuário:", error);
                }
            }
        }

        fetchUser();
    }, [session])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (message: string, model?: string) => {
        if (!message.trim()) return;

        try {
            setIsLoading(true);

            const userMessage: ChatMessage = { role: "user", content: message };
            const updatedMessages = [...messages, userMessage];
            setMessages(updatedMessages);

            const response = await chatService.sendMessage(updatedMessages);

            const botMessage: ChatMessage = { role: "model", content: response };
            const finalMessages = [...updatedMessages, botMessage];
            setMessages(finalMessages);

            // Salvar conversa no banco de dados
            if (user?.id) {
                try {
                    const chatHistoryMessages: ChatHistoryMessage[] = finalMessages.map(msg => ({
                        role: msg.role,
                        content: msg.content,
                        timestamp: new Date()
                    }));

                    if (currentConversationId) {
                        // Atualizar conversa existente
                        await chatHistoryService.updateConversation(
                            currentConversationId,
                            undefined,
                            chatHistoryMessages
                        );
                    } else {
                        // Criar nova conversa
                        const title = chatHistoryService.generateTitle(message);
                        const conversationId = await chatHistoryService.saveConversation(
                            user.id,
                            title,
                            chatHistoryMessages
                        );
                        setCurrentConversationId(conversationId);
                    }
                } catch (error) {
                    console.error("Erro ao salvar conversa:", error);
                    // Não mostrar erro para o usuário, apenas log
                }
            }
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

    const handleLoadConversation = (historyMessages: ChatHistoryMessage[]) => {
        const convertedMessages: ChatMessage[] = historyMessages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        setMessages(convertedMessages);
        setCurrentConversationId(null); // Reset para criar nova conversa
    };

    const handleNewChat = () => {
        setMessages([]);
        setCurrentConversationId(null);
    };

    function handleClickCard(Message: string) {
        if (!session) {
            addToast({
                title: "Acesso Negado",
                description: "Você precisa estar logado para usar essa funcionalidade.",
                classNames: {
                    base: cn([
                        "bg-default-50 dark:bg-background shadow-sm",
                        "border border-l-8 rounded-md rounded-l-none",
                        "flex flex-col items-start",
                        "border-primary-200 dark:border-primary-100 border-l-primary",
                    ]),
                    icon: "w-6 h-6 fill-current",
                },
                endContent: (
                    <div className="ms-11 my-2 flex gap-x-2">
                        <ButtonHeroUi color={"primary"} size="sm" variant="bordered">
                            <Link href="/login">Entrar</Link>
                        </ButtonHeroUi>
                        <ButtonHeroUi className="underline-offset-2" color={"primary"} size="sm" variant="light">
                            <Link href="/register">Cadastre-se</Link>

                        </ButtonHeroUi>
                    </div>
                ),
                color: "danger",
            });
            return;
        } else {
            handleSendMessage(Message);
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] bg-background text-foreground max-w-screen-xl mx-auto">
            {/* Header */}
            <header className="p-3 flex items-center justify-between bg-background/80 backdrop-blur-sm">
                <BackButton variant="ghost" size="sm" fallbackUrl="/" />
                <div className="flex items-center gap-2">
                    {session && user?.id && (
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => setIsHistoryModalOpen(true)}
                            title="Ver histórico de conversas"
                        >
                            <History className="h-4 w-4" />
                        </Button>
                    )}
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleNewChat}
                        title="Nova conversa"
                    >
                        <PlusIcon className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto px-4 py-2 sm:p-6 max-w-5xl mx-auto w-full">
                    {/* Messages */}
                    <div className="w-full space-y-4 mb-4">
                        {messages.map((message, index) => (
                            <Message key={index} message={message} userProfile={user?.image as string} />
                        ))}
                        {isLoading && <LoadingMessage />}
                        <div ref={messagesEndRef} />
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
                                    onClick={() => handleClickCard(prompt.message)}
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

            {/* Chat History Modal */}
            {session && user?.id && (
                <ChatHistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setIsHistoryModalOpen(false)}
                    userId={user.id}
                    onLoadConversation={handleLoadConversation}
                />
            )}
        </div>
    );
}