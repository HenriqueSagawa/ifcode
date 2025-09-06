'use client';

import { useRef, useEffect, useState } from "react";
import { PaperclipIcon, ArrowUpIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IoSparklesOutline } from "react-icons/io5";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { AVAILABLE_MODELS } from "@/lib/gemini/config";
import { useSession } from "next-auth/react";
import { addToast } from "@heroui/toast";
import { cn } from "@heroui/theme";
import Link from "next/link";

interface PromptInputProps {
    onSendMessage: (message: string, model?: string) => void;
    isLoading?: boolean;
    onLoadingMessage?: () => void;
}

export function PromptInput({ onSendMessage, isLoading = false, onLoadingMessage }: PromptInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
    const maxHeight = 144;
    const { data: session } = useSession();

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        }
    };

    const handleInput = () => {
        adjustHeight();
        setInputValue(textareaRef.current?.value || "");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            addToast({
                title: "Autenticação necessária",
                description: "Você precisa estar logado para enviar mensagens no chat.",
                color: 'danger',
                endContent: (
                    <div className="ms-11 my-2 flex flex-row gap-1">
                        <Link href={"/login"}>
                            <Button color={"primary"} size="sm" variant="outline" className="rounded">
                                Entrar
                            </Button>
                        </Link>


                        <Link href={"/register"}>
                            <Button className="underline-offset-2 rounded" color={"primary"} size="sm" variant="default">
                                Cadastrar
                            </Button>
                        </Link>

                    </div>
                ),
                classNames: {
                    base: cn([
                        "flex flex-col items-start",
                    ])
                }
            });
            return;
        }

        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue, selectedModel);
            if (onLoadingMessage) {
                onLoadingMessage();
            }
            setInputValue("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "1.5em";
            }
        }
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "1.5em";
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="mx-auto p-2 sm:p-4 max-w-3xl w-[95%] sm:w-[90%] md:w-full border rounded-xl bg-background">
            <div className="w-full">
                <textarea
                    ref={textareaRef}
                    placeholder="Pergunte-me algo..."
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    value={inputValue}
                    rows={1}
                    disabled={isLoading}
                    className="w-full resize-none text-foreground text-sm border-none bg-transparent outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 !scrollbar-track-transparent disabled:opacity-50"
                    style={{
                        minHeight: "1.5em",
                        maxHeight: `${maxHeight}px`,
                        lineHeight: "1.5",
                    }}
                />
            </div>
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                    <Button variant="ghost" className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0" disabled={isLoading}>
                        <PaperclipIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as typeof selectedModel)} disabled={isLoading}>
                        <SelectTrigger className="border-none outline-none bg-transparent hover:bg-transparent focus:bg-transparent focus:ring-0 focus:border-none">
                            <SelectValue placeholder="Gemini 2.0 Flash" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Gemini</SelectLabel>
                                {AVAILABLE_MODELS.map((model) => (
                                    <SelectItem key={model} value={model}>
                                        {model}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0" disabled={isLoading}>
                        <IoSparklesOutline className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                        type="submit"
                        className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0 ml-2"
                        disabled={isLoading || !inputValue.trim()}
                    >
                        {isLoading ? (
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        ) : (
                            <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}