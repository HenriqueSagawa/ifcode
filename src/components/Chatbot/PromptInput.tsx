// Diretiva do Next.js para Client Component, necessária para hooks e interações do navegador.
'use client';

// Importações de Hooks, Componentes e Utilidades
import { useRef, useEffect, useState } from "react"; // Hooks do React
import { PaperclipIcon, ArrowUpIcon, Loader2 } from "lucide-react"; // Ícones
import { Button } from "@/components/ui/button"; // Componente Botão (Shadcn)
import { IoSparklesOutline } from "react-icons/io5"; // Outro ícone (React Icons)
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"; // Componentes Select (Shadcn)
import { AVAILABLE_MODELS } from "@/lib/gemini/config"; // Constante com os modelos de IA disponíveis
import { useSession } from "next-auth/react"; // Hook para verificar a sessão do usuário (autenticação)
import { addToast } from "@heroui/toast"; // Função para exibir notificações

/**
 * Props para o componente PromptInput.
 * @typedef {object} PromptInputProps
 * @property {(message: string, model: string) => void} onSendMessage - Função callback chamada quando o usuário envia uma mensagem. Recebe o texto da mensagem e o modelo selecionado.
 * @property {boolean} [isLoading=false] - Flag opcional que indica se uma resposta está sendo carregada. Desabilita o input e mostra um ícone de loading no botão de enviar.
 * @property {() => void} [onLoadingMessage] - Função callback opcional chamada *imediatamente* após o envio da mensagem, útil para exibir um placeholder de "digitando..." do modelo.
 */
interface PromptInputProps {
  onSendMessage: (message: string, model: string) => void;
  isLoading?: boolean;
  onLoadingMessage?: () => void;
}

/**
 * Componente que renderiza a caixa de entrada de texto (prompt) para o chat.
 * Permite ao usuário digitar mensagens, selecionar um modelo de IA,
 * e enviar a mensagem. Inclui ajuste automático de altura do textarea,
 * tratamento de envio com Enter, e verificação de autenticação.
 *
 * @component
 * @param {PromptInputProps} props - As propriedades do componente.
 * @returns {JSX.Element} O elemento JSX do formulário de entrada do prompt.
 */
export function PromptInput({ onSendMessage, isLoading = false, onLoadingMessage }: PromptInputProps) {
    // Ref para acessar diretamente o elemento textarea do DOM.
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // Estado para armazenar o valor atual do input do usuário.
    const [inputValue, setInputValue] = useState<string>("");
    // Estado para armazenar o modelo de IA selecionado pelo usuário. Inicializa com o primeiro da lista.
    const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
    // Altura máxima permitida para o textarea em pixels.
    const maxHeight = 144;
    // Hook para obter dados da sessão do usuário (usado para verificar se está logado).
    const { data: session } = useSession();

    /**
     * Ajusta a altura do textarea dinamicamente com base no conteúdo,
     * até atingir a altura máxima definida (`maxHeight`).
     * Reseta a altura para 'auto' primeiro para obter o scrollHeight correto.
     */
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // Reseta para calcular o scrollHeight real
            // Define a nova altura, limitada pelo maxHeight
            textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        }
    };

    /**
     * Handler para o evento `onInput` do textarea.
     * Chama `adjustHeight` para redimensionar o textarea enquanto o usuário digita.
     * Atualiza o estado `inputValue` com o valor atual do textarea.
     */
    const handleInput = () => {
        adjustHeight(); // Ajusta a altura a cada caractere digitado
        setInputValue(textareaRef.current?.value || ""); // Atualiza o estado com o valor do input
    };

    /**
     * Handler para o evento `onKeyDown` do textarea.
     * Verifica se a tecla pressionada foi 'Enter' *sem* a tecla 'Shift'.
     * Se for, previne o comportamento padrão (nova linha) e chama `handleSubmit`
     * para enviar a mensagem.
     * @param {React.KeyboardEvent<HTMLTextAreaElement>} e - O evento de teclado.
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Impede a criação de nova linha no textarea
            handleSubmit(e as any); // Trata o evento como um submit de formulário
        }
    };

    /**
     * Handler para o evento `onSubmit` do formulário (disparado pelo botão ou Enter).
     * Previne o comportamento padrão de submit do formulário.
     * Verifica se o usuário está logado (`session`). Se não, exibe um toast e retorna.
     * Se logado, verifica se há texto no input (`inputValue.trim()`) e se não está carregando (`!isLoading`).
     * Se as condições forem atendidas:
     *   - Chama `onSendMessage` com o texto e o modelo selecionado.
     *   - Chama `onLoadingMessage` (se fornecido).
     *   - Limpa o estado `inputValue`.
     *   - Reseta a altura do textarea para o valor inicial.
     * @param {React.FormEvent} e - O evento de formulário.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Verifica se o usuário está autenticado
        if (!session) {
            addToast({
                title: "Autenticação necessária",
                description: "Você precisa estar logado para enviar mensagens no chat.",
                color: 'danger'
            });
            return; // Interrompe o envio se não estiver logado
        }

        // Verifica se há conteúdo e se não está em estado de loading
        if (inputValue.trim() && !isLoading) {
            // Chama a função passada por props para enviar a mensagem
            onSendMessage(inputValue, selectedModel);
            // Chama a função opcional para indicar que o envio começou (ex: mostrar loading)
            if (onLoadingMessage) {
                onLoadingMessage();
            }
            // Limpa o campo de texto
            setInputValue("");
            // Reseta a altura do textarea para o mínimo após o envio
            if (textareaRef.current) {
                textareaRef.current.style.height = "1.5em"; // Define altura inicial (ajuste conforme necessário)
            }
        }
    };

    /**
     * Efeito que roda uma vez após a montagem inicial do componente.
     * Define a altura inicial mínima do textarea.
     */
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "1.5em"; // Define a altura inicial mínima
        }
    }, []); // Array de dependências vazio garante que rode apenas na montagem.

    // Renderização do componente JSX
    return (
        // Formulário principal que engloba o input e os botões.
        // Captura o evento onSubmit. Estilizado com borda, cantos arredondados, etc.
        <form onSubmit={handleSubmit} className="mx-auto p-2 sm:p-4 max-w-3xl w-[95%] sm:w-[90%] md:w-full border rounded-xl bg-background">
            {/* Container do textarea */}
            <div className="w-full">
                {/* O campo de texto principal para o usuário digitar */}
                <textarea
                    ref={textareaRef} // Referência para manipulação direta (altura)
                    placeholder="Pergunte-me algo..." // Texto de placeholder
                    onInput={handleInput} // Handler para quando o usuário digita
                    onKeyDown={handleKeyDown} // Handler para capturar o Enter
                    value={inputValue} // Controlado pelo estado inputValue
                    rows={1} // Começa com uma linha visualmente
                    disabled={isLoading} // Desabilitado durante o carregamento da resposta
                    className="w-full resize-none text-foreground text-sm border-none bg-transparent outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 !scrollbar-track-transparent disabled:opacity-50" // Estilização: sem resize manual, cores, sem borda/outline padrão, scroll customizado, opacidade quando desabilitado
                    style={{
                        minHeight: "1.5em", // Altura mínima definida via style
                        maxHeight: `${maxHeight}px`, // Altura máxima definida via style
                        lineHeight: "1.5", // Espaçamento entre linhas
                    }}
                />
            </div>
            {/* Container inferior com botões e seleção de modelo */}
            <div className="flex items-center justify-between mt-2">
                {/* Controles do lado esquerdo */}
                <div className="flex items-center">
                    {/* Botão de Anexo (funcionalidade não implementada aqui) */}
                    <Button variant="ghost" className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0" disabled={isLoading}>
                        <PaperclipIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    {/* Seletor de Modelo de IA */}
                    <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as typeof selectedModel)} disabled={isLoading}>
                        {/* Trigger (parte visível) do Select - estilizado para parecer texto simples */}
                        <SelectTrigger className="border-none outline-none bg-transparent hover:bg-transparent focus:bg-transparent focus:ring-0 focus:border-none h-auto p-1 text-xs text-muted-foreground hover:text-foreground">
                            <SelectValue placeholder="Gemini 2.0 Flash" /> {/* Placeholder padrão */}
                        </SelectTrigger>
                        {/* Conteúdo do dropdown do Select */}
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Gemini</SelectLabel> {/* Rótulo do grupo */}
                                {/* Mapeia os modelos disponíveis para criar itens selecionáveis */}
                                {AVAILABLE_MODELS.map((model) => (
                                    <SelectItem key={model} value={model}>
                                        {model}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* Controles do lado direito */}
                <div className="flex items-center">
                    {/* Botão de "Sparkles" (funcionalidade não implementada aqui) */}
                    <Button variant="ghost" className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0" disabled={isLoading}>
                        <IoSparklesOutline className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    {/* Botão de Enviar Mensagem */}
                    <Button
                        type="submit" // Define como botão de submit do formulário
                        className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0 ml-2" // Estilização
                        disabled={isLoading || !inputValue.trim()} // Desabilitado se carregando OU se não houver texto
                    >
                        {/* Ícone condicional: Loader se carregando, Seta para cima caso contrário */}
                        {isLoading ? (
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> // Ícone de loading com animação
                        ) : (
                            <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4" /> // Ícone de enviar
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}