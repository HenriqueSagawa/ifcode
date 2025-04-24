'use client';

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { TypingEffect } from "./TypingEffect";
import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToast } from "@heroui/toast";

interface MessageProps {
    message: {
        role: "user" | "model";
        content: string;
    };
    userProfile?: string
}

export function Message({ message, userProfile }: MessageProps) {
    const isUser = message.role === "user";
    const messageRef = useRef<HTMLDivElement>(null);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [userHasScrolled, setUserHasScrolled] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setIsCopied(true);
            addToast({
                title: "Copiado!",
                description: "Texto copiado para a área de transferência",
                color: "success",
            });
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            addToast({
                title: "Erro",
                description: "Não foi possível copiar o texto",
                color: "danger",
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setUserHasScrolled(true);
        };

        window.addEventListener('wheel', handleScroll);
        window.addEventListener('touchmove', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('touchmove', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (messageRef.current && !userHasScrolled) {
            const scrollOptions = {
                behavior: "smooth" as ScrollBehavior,
                block: "end" as ScrollLogicalPosition
            };
            messageRef.current.scrollIntoView(scrollOptions);
        }
    }, [message.content, displayedText, userHasScrolled]);

    useEffect(() => {
        if (!isTypingComplete) {
            setUserHasScrolled(false);
        }
    }, [isTypingComplete]);

    if (isUser) {
        return (
            <div ref={messageRef} className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2 mb-4`}>
                <Card className={`max-w-[70%] p-3 pb-6 ${isUser ? "bg-muted" : "bg-muted/50"} group relative`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="rounded-full absolute bottom-0 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full" 
                            onClick={handleCopy}
                        >
                            {isCopied ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4   w-4" />
                            )}
                        </Button>
                    </div>
                </Card>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile} alt="Usuário" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        );
    }

    const markdownComponents = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <div className="relative">
                    <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                        {match[1]}
                    </div>
                    <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                        className="rounded-lg"
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div ref={messageRef} className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2 mb-4`}>
            <div className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center">
                <Image src="/img/logo ifcode.png" alt="Logo" width={100} priority height={100} className="rounded-full w-full h-full" />
            </div>
            <Card className={`max-w-[70%] p-3 pb-6 ${isUser ? "bg-muted" : "bg-muted/50"} group relative`}>
                <div className="prose prose-invert max-w-none dark:prose-invert">
                    <div style={{ display: 'none' }}>
                        <TypingEffect 
                            text={message.content} 
                            onComplete={() => setIsTypingComplete(true)}
                            onUpdate={(text) => setDisplayedText(text)}
                        />
                    </div>
                    <ReactMarkdown components={markdownComponents}>
                        {isTypingComplete ? message.content : displayedText}
                    </ReactMarkdown>
                </div>
                <div className="absolute bottom-0 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full" 
                        onClick={handleCopy}
                    >
                        {isCopied ? (
                            <Check className="h-3 w-3" />
                        ) : (
                            <Copy className="h-3 w-3" />
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
} 