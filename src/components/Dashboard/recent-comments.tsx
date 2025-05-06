// Diretiva do Next.js para Client Component, necessária para usar useState e interações (paginação).
"use client";

import { useState } from "react"; // Hook do React para gerenciar o estado da página atual.
// Importações de componentes UI (presumivelmente Shadcn/ui ou similar)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Importações de ícones da biblioteca lucide-react
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
// Importação do componente Link do Next.js para navegação client-side.
import Link from "next/link";

/**
 * @typedef {object} Author
 * @property {string} name - Nome do autor do comentário.
 * @property {string} avatar - URL da imagem de avatar do autor.
 */

/**
 * @typedef {object} Comment
 * @property {string} id - Identificador único do comentário.
 * @property {string} postId - ID do post ao qual o comentário pertence.
 * @property {string} postTitle - Título do post ao qual o comentário pertence.
 * @property {Author} author - Objeto contendo informações do autor.
 * @property {string} content - O texto do comentário.
 * @property {string} date - Data formatada do comentário.
 */
type Comment = {
  id: string;
  postId: string;
  postTitle: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string; // Mantido como string conforme o exemplo
};

/**
 * Componente que exibe uma lista paginada dos últimos comentários em um Card.
 * Utiliza dados simulados (`allComments`) para demonstração.
 * Cada comentário mostra o título do post (linkado), um trecho do comentário,
 * o autor (com avatar) e a data. Inclui controles de paginação.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX que renderiza o card de comentários recentes.
 */
export function RecentComments() {
  // --- Simulação de Dados ---
  // Em uma aplicação real, estes dados viriam de uma API.
  const allComments: Comment[] = [
    {
      id: "comment1",
      postId: "post1", // ID do post para o link
      postTitle: "Introdução ao Next.js 14",
      author: { name: "Maria Oliveira", avatar: "/avatar-maria.png" }, // Dados do autor
      content: "Excelente artigo! Consegui entender perfeitamente as novas funcionalidades do Next.js 14.", // Conteúdo do comentário
      date: "24 Fev 2025" // Data formatada
    },
    {
      id: "comment2",
      postId: "post2",
      postTitle: "Como configurar um projeto com TypeScript",
      author: { name: "Pedro Santos", avatar: "/avatar-pedro.png" },
      content: "Você poderia explicar melhor a parte de configuração do tsconfig.json?",
      date: "20 Fev 2025"
    },
    {
      id: "comment3",
      postId: "post3",
      postTitle: "Tailwind CSS vs. CSS Modules",
      author: { name: "Ana Lima", avatar: "/avatar-ana.png" },
      content: "Concordo com sua análise. Tenho usado o Tailwind há alguns meses e a produtividade aumentou bastante.",
      date: "15 Fev 2025"
    },
    {
      id: "comment4",
      postId: "post4",
      postTitle: "Criando uma API REST com Next.js",
      author: { name: "Carlos Mendes", avatar: "/avatar-carlos.png" },
      content: "Consegui implementar a API seguindo seu tutorial. Muito obrigado pela ajuda!",
      date: "12 Fev 2025"
    },
    {
      id: "comment5",
      postId: "post5",
      postTitle: "Como otimizar o desempenho do seu site Next.js",
      author: { name: "Juliana Costa", avatar: "/avatar-juliana.png" },
      content: "As dicas de otimização de imagens foram muito úteis. Meu site carrega muito mais rápido agora.",
      date: "07 Fev 2025"
    },
    // Adicione mais comentários simulados se necessário para testar a paginação.
  ];
  // --- Fim da Simulação de Dados ---

  // Estado para controlar a página atual da paginação. Inicia na página 1.
  const [currentPage, setCurrentPage] = useState(1);
  // Define quantos comentários serão exibidos por página.
  const commentsPerPage = 3;

  // --- Lógica de Paginação ---
  // Calcula o índice do último comentário na página atual.
  const indexOfLastComment = currentPage * commentsPerPage;
  // Calcula o índice do primeiro comentário na página atual.
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  // Extrai (fatia) os comentários que devem ser exibidos na página atual do array completo.
  const currentComments = allComments.slice(indexOfFirstComment, indexOfLastComment);
  // Calcula o número total de páginas necessárias para exibir todos os comentários.
  const totalPages = Math.ceil(allComments.length / commentsPerPage);

  // --- Funções de Navegação ---
  /** Navega para a próxima página, limitado pelo número total de páginas. */
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  /** Navega para a página anterior, limitado à página 1. */
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // --- Renderização do Componente ---
  return (
    // O Card principal que envolve todo o conteúdo. `h-full` tenta ocupar a altura disponível.
    <Card className="h-full flex flex-col"> {/* Adicionado flex flex-col para melhor controle da altura */}
      <CardHeader className="pb-3 flex-shrink-0"> {/* Impede que o header encolha */}
        <CardTitle className="text-xl font-semibold">Últimos Comentários</CardTitle>
      </CardHeader>
      {/* Conteúdo do Card, permitindo scroll interno se necessário */}
      <CardContent className="flex-grow overflow-y-auto space-y-4"> {/* Permite scroll se o conteúdo exceder */}
        {/* Mapeia os comentários da página atual para renderizar cada um. */}
        {currentComments.map(comment => (
          // Container para cada comentário individual.
          <div key={comment.id} className="rounded-lg border p-4 space-y-2"> {/* Adicionado space-y */}
            {/* Cabeçalho do comentário: Título do post e Data */}
            <div className="flex items-center justify-between">
              {/* Link para o post original */}
              <Link
                href={`/posts/${comment.postId}`} // URL dinâmica baseada no ID do post
                className="text-sm font-medium text-primary hover:underline truncate pr-2" // Trunca texto longo
                title={comment.postTitle} // Tooltip com o título completo
              >
                {comment.postTitle}
              </Link>
              {/* Data do comentário */}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                <Calendar className="h-3 w-3 mr-1" />
                {comment.date}
              </div>
            </div>

            {/* Conteúdo do comentário (com limite de linhas) */}
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2" title={comment.content}> {/* `line-clamp-2` limita a 2 linhas */}
              {comment.content}
            </p>

            {/* Rodapé do comentário: Avatar e Nome do Autor */}
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                {/* Fallback caso a imagem não carregue, mostra a inicial do nome. */}
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{comment.author.name}</span>
            </div>
          </div>
        ))}
        {/* Mensagem se não houver comentários na página atual (ou no total) */}
         {currentComments.length === 0 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">Nenhum comentário para exibir.</p>
         )}
      </CardContent>

      {/* Seção de Paginação (fixa na parte inferior do CardContent se houver comentários) */}
      {totalPages > 1 && ( // Só mostra paginação se houver mais de uma página
        <div className="flex items-center justify-between mt-auto p-4 border-t flex-shrink-0"> {/* Fixa na parte inferior */}
          {/* Texto indicando a página atual e o total */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Página {currentPage} de {totalPages}
          </p>
          {/* Botões de navegação */}
          <div className="flex space-x-2">
            {/* Botão "Anterior" */}
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              disabled={currentPage === 1} // Desabilitado na primeira página
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {/* Botão "Próxima" */}
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages} // Desabilitado na última página
              aria-label="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}