// Diretiva do Next.js (App Router) que marca este como um Client Component.
// Embora este componente específico não use hooks (useState/useEffect),
// marcá-lo como Client Component pode ser necessário dependendo de onde
// ele é importado ou se futuras interações forem adicionadas.
'use client';

import Image from 'next/image'; // Importa o componente otimizado de imagem do Next.js
import { Loader2 } from 'lucide-react'; // Importa o ícone de carregamento (spinner) da biblioteca lucide-react
import { Card } from "@/components/ui/card"; // Importa um componente Card reutilizável (provavelmente da UI Shadcn ou similar)

/**
 * Componente que exibe um indicador visual de "carregando" ou "digitando".
 * É estilizado para se assemelhar a uma mensagem recebida em uma interface de chat,
 * mostrando o logo do "remetente" (IF Code), um ícone de carregamento giratório
 * e o texto "Digitando...".
 *
 * @component
 * @returns {JSX.Element} O elemento JSX que representa a mensagem de carregamento.
 */
export function LoadingMessage() {
    return (
        // Container principal da mensagem, alinhado à esquerda (justify-start)
        // com espaçamento entre o logo e o card (gap-2) e margem inferior (mb-4).
        <div className="flex justify-start gap-2 mb-4">
            {/* Container para a imagem/avatar do "remetente" */}
            <div className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center">
                {/* Imagem do logo do IF Code usando o componente otimizado Image do Next.js.
                    'priority' sugere que esta imagem é importante e deve ser carregada com prioridade (ex: LCP).
                    A imagem é arredondada e dimensionada para preencher seu container. */}
                <Image
                    src="/img/logo ifcode.png"
                    alt="Logo IF Code" // Texto alternativo para acessibilidade
                    width={100} // Largura intrínseca da imagem (para cálculo de aspect ratio)
                    height={100} // Altura intrínseca da imagem
                    priority // Otimização de carregamento
                    className="rounded-full w-full h-full" // Estilos para arredondar e ajustar ao container
                />
            </div>
            {/* Card que serve como "balão" da mensagem.
                Limita a largura máxima, adiciona padding interno e um fundo semi-transparente. */}
            <Card className="max-w-[80%] p-3 bg-muted/50">
                {/* Container interno do card para alinhar o ícone e o texto. */}
                <div className="flex items-center gap-2">
                    {/* Ícone de carregamento (Loader2) com animação de giro (animate-spin)
                        e cor primária definida pelo tema/Tailwind config. */}
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    {/* Texto indicando a ação em andamento. */}
                    <p className="text-sm">Digitando...</p>
                </div>
            </Card>
        </div>
    );
}