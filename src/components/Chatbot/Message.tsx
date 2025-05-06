// Diretiva do Next.js (App Router) para marcar como Client Component,
// necessário para usar hooks (useState, useEffect, useRef) e lidar com eventos do navegador.
'use client';

// Importações de Componentes e Bibliotecas
import { Card } from "@/components/ui/card"; // Componente Card da UI (provavelmente Shadcn)
import Image from "next/image"; // Componente otimizado de imagem do Next.js
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Componentes para exibir avatares (Shadcn)
import ReactMarkdown from "react-markdown"; // Biblioteca para renderizar conteúdo Markdown em React
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"; // Biblioteca para aplicar syntax highlighting em blocos de código
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Tema específico para o SyntaxHighlighter
import { TypingEffect } from "./TypingEffect"; // Componente customizado para simular efeito de digitação
import { useEffect, useRef, useState } from "react"; // Hooks do React para estado, efeitos colaterais e referências a elementos DOM
import { Copy, Check } from "lucide-react"; // Ícones da biblioteca Lucide
import { Button } from "@/components/ui/button"; // Componente Button da UI (Shadcn)
import { addToast } from "@heroui/toast"; // Função para exibir notificações toast (pop-ups)

/**
 * @typedef {object} MessageData
 * @property {'user' | 'model'} role - Indica quem enviou a mensagem (usuário ou modelo/IA).
 * @property {string} content - O conteúdo textual da mensagem (pode conter Markdown).
 */

/**
 * Props para o componente Message.
 * @typedef {object} MessageProps
 * @property {MessageData} message - O objeto contendo os dados da mensagem (role e content).
 * @property {string} [userProfile] - URL opcional da imagem de perfil do usuário.
 */
interface MessageProps {
    message: {
        role: "user" | "model";
        content: string;
    };
    userProfile?: string; // Opcional, usado apenas se a mensagem for do usuário
}

/**
 * Componente para renderizar uma única mensagem em uma interface de chat.
 * Diferencia a aparência e o comportamento com base no remetente (`user` ou `model`).
 * Inclui funcionalidades como:
 * - Renderização de Markdown e syntax highlighting para mensagens do modelo.
 * - Efeito de digitação para mensagens do modelo.
 * - Botão para copiar o conteúdo da mensagem.
 * - Auto-scroll para novas mensagens (com detecção de scroll manual do usuário).
 * - Exibição de avatar para o usuário e logo para o modelo.
 *
 * @component
 * @param {MessageProps} props - As propriedades do componente.
 * @returns {JSX.Element} O elemento JSX que representa a mensagem formatada.
 */
export function Message({ message, userProfile }: MessageProps) {
    // Determina se a mensagem é do usuário para aplicar estilos/lógicas condicionais.
    const isUser = message.role === "user";
    // Ref para o elemento DOM principal da mensagem, usado para o auto-scroll.
    const messageRef = useRef<HTMLDivElement>(null);
    // Estado para controlar se o efeito de digitação da mensagem do modelo foi concluído.
    const [isTypingComplete, setIsTypingComplete] = useState(isUser); // Mensagens do usuário já estão "completas".
    // Estado para armazenar o texto exibido durante o efeito de digitação.
    const [displayedText, setDisplayedText] = useState('');
    // Estado para rastrear se o usuário rolou manualmente a página, para desativar o auto-scroll.
    const [userHasScrolled, setUserHasScrolled] = useState(false);
    // Estado para controlar o ícone do botão de copiar (Copy/Check).
    const [isCopied, setIsCopied] = useState(false);

    /**
     * Função assíncrona para copiar o conteúdo da mensagem para a área de transferência.
     * Exibe notificações toast de sucesso ou erro.
     * Atualiza o estado `isCopied` para mudar o ícone do botão temporariamente.
     */
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content); // Copia o texto
            setIsCopied(true); // Muda o ícone para Check
            addToast({ // Exibe notificação de sucesso
                title: "Copiado!",
                description: "Texto copiado para a área de transferência",
                color: "success",
            });
            // Reseta o ícone após 2 segundos
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            addToast({ // Exibe notificação de erro
                title: "Erro",
                description: "Não foi possível copiar o texto",
                color: "danger",
            });
            console.error("Erro ao copiar:", err); // Loga o erro no console
        }
    };

    /**
     * Efeito para detectar scroll manual do usuário (roda ou toque).
     * Se o usuário rolar, define `userHasScrolled` como true para parar o auto-scroll.
     * Adiciona e remove event listeners na montagem e desmontagem do componente.
     */
    useEffect(() => {
        const handleScroll = () => {
            setUserHasScrolled(true);
        };

        window.addEventListener('wheel', handleScroll, { passive: true }); // Otimização para eventos de roda
        window.addEventListener('touchmove', handleScroll, { passive: true }); // Otimização para eventos de toque

        // Função de limpeza: remove os listeners quando o componente é desmontado.
        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('touchmove', handleScroll);
        };
    }, []); // Array vazio significa que este efeito roda apenas na montagem/desmontagem.

    /**
     * Efeito para realizar o auto-scroll da mensagem para a visão.
     * Roda quando o conteúdo da mensagem muda ou o texto do efeito de digitação é atualizado.
     * Só executa o scroll se o elemento `messageRef` existir e se o usuário *não* tiver rolado manualmente.
     */
    useEffect(() => {
        // Verifica se o ref está pronto e se o usuário não interrompeu o scroll
        if (messageRef.current && !userHasScrolled) {
            const scrollOptions = {
                behavior: "smooth" as ScrollBehavior, // Animação suave
                block: "end" as ScrollLogicalPosition   // Alinha a parte inferior do elemento com a parte inferior da viewport
            };
            // Executa o scroll
            messageRef.current.scrollIntoView(scrollOptions);
        }
    }, [message.content, displayedText, userHasScrolled]); // Depende do conteúdo, texto digitado e estado de scroll do usuário.

    /**
     * Efeito para resetar o bloqueio de auto-scroll (`userHasScrolled`)
     * quando o efeito de digitação de uma *nova* mensagem do modelo começa.
     * (Assumindo que `isTypingComplete` vai para `false` quando uma nova mensagem do modelo chega).
     */
    useEffect(() => {
        if (!isTypingComplete) {
            setUserHasScrolled(false); // Permite o auto-scroll novamente para a nova mensagem
        }
    }, [isTypingComplete]); // Roda quando o estado de digitação muda.

    // --- Renderização Condicional: Mensagem do Usuário ---
    if (isUser) {
        return (
            // Container principal da mensagem, alinhado à direita (justify-end).
            <div ref={messageRef} className={`flex justify-end gap-2 mb-4`}>
                {/* Card contendo o texto da mensagem. Fundo diferente para usuário. 'group' habilita hover no pai. */}
                <Card className={`max-w-[70%] p-3 pb-6 bg-muted group relative`}>
                    {/* Conteúdo da mensagem. `whitespace-pre-wrap` preserva espaços e quebras de linha. */}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {/* Botão de copiar: posicionado absolutamente, aparece no hover do Card (`group-hover`). */}
                    <div className="rounded-full absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost" // Botão sem fundo
                            size="icon" // Tamanho de ícone
                            className="h-6 w-6 rounded-full" // Estilo customizado de tamanho/forma
                            onClick={handleCopy} // Ação ao clicar
                            aria-label="Copiar mensagem" // Acessibilidade
                        >
                            {/* Ícone condicional: Check se copiado, Copy caso contrário */}
                            {isCopied ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </Card>
                {/* Avatar do usuário */}
                <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile} alt="Usuário" /> {/* Imagem do perfil */}
                    <AvatarFallback>U</AvatarFallback> {/* Fallback caso a imagem não carregue */}
                </Avatar>
            </div>
        );
    }

    // --- Renderização Condicional: Mensagem do Modelo ---

    // Configuração para o componente ReactMarkdown, especificamente para customizar blocos de código.
    const markdownComponents = {
        // Sobrescreve a renderização padrão do elemento `code` do Markdown.
        code({ node, inline, className, children, ...props }: any) {
            // Tenta extrair a linguagem do bloco de código (ex: 'language-javascript').
            const match = /language-(\w+)/.exec(className || '');
            // Se NÃO for um código inline e tiver uma linguagem definida:
            return !inline && match ? (
                // Renderiza usando SyntaxHighlighter
                <div className="relative my-2"> {/* Container para posicionar o nome da linguagem */}
                    {/* Nome da linguagem no canto superior direito */}
                    <div className="absolute right-2 top-2 text-xs text-muted-foreground bg-background/50 px-1 rounded">
                        {match[1]}
                    </div>
                    <SyntaxHighlighter
                        style={vscDarkPlus as any} // Aplica o tema importado
                        language={match[1]}        // Define a linguagem para highlighting
                        PreTag="div"               // Usa uma div como container em vez de <pre>
                        {...props}
                        className="rounded-md !bg-black" // Estilização customizada do bloco
                    >
                        {String(children).replace(/\n$/, '')} {/* Remove a última quebra de linha */}
                    </SyntaxHighlighter>
                </div>
            ) : (
                // Se for código inline ou sem linguagem definida, renderiza como `<code>` padrão,
                // mas com estilo para diferenciar (ex: fundo, padding).
                <code className={`${className} bg-muted/50 text-foreground px-1 py-0.5 rounded`} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        // Container principal da mensagem, alinhado à esquerda (justify-start).
        <div ref={messageRef} className={`flex justify-start gap-2 mb-4`}>
            {/* Logo do IF Code (usado como avatar do modelo) */}
            <div className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center flex-shrink-0">
                <Image src="/img/logo ifcode.png" alt="Logo IF Code" width={100} priority height={100} className="rounded-full w-full h-full" />
            </div>
            {/* Card contendo a mensagem do modelo. 'group' habilita hover. */}
            <Card className={`max-w-[70%] p-3 pb-6 bg-muted/50 group relative`}>
                {/* Container para aplicar estilos de "prosa" (leitura de texto longo) ao conteúdo Markdown.
                    Ajusta espaçamento, fontes, etc. `prose-invert` para tema escuro. */}
                <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert prose-p:my-2 prose-pre:my-2 prose-headings:my-2">
                    {/* Componente TypingEffect: responsável por gerar o texto letra por letra.
                        É mantido *oculto* (`display: 'none'`) porque seu único propósito aqui
                        é atualizar o estado `displayedText` via `onUpdate`.
                        O texto real é renderizado pelo ReactMarkdown abaixo. */}
                    <div style={{ display: 'none' }}>
                        <TypingEffect
                            text={message.content} // O texto completo a ser "digitado"
                            onComplete={() => setIsTypingComplete(true)} // Callback quando a digitação termina
                            onUpdate={(text) => setDisplayedText(text)} // Callback a cada atualização do texto digitado
                        />
                    </div>
                    {/* Renderiza o conteúdo Markdown.
                        Usa o texto completo (`message.content`) se a digitação estiver completa,
                        ou o texto parcial (`displayedText`) durante a digitação.
                        Passa a configuração `markdownComponents` para customizar a renderização. */}
                    <ReactMarkdown components={markdownComponents}>
                        {isTypingComplete ? message.content : displayedText}
                    </ReactMarkdown>
                </div>
                {/* Botão de copiar: idêntico ao da mensagem do usuário, aparece no hover. */}
                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={handleCopy}
                        aria-label="Copiar mensagem"
                    >
                        {isCopied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}