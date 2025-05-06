// Diretiva do Next.js para Client Component, necessária para useState e interações (paginação).
"use client";

import { useState } from "react"; // Hook do React para gerenciar o estado da página atual.
// Importações de componentes UI (presumivelmente Shadcn/ui ou similar)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Componente para exibir "etiquetas" de tipo de post
// Importações de ícones da biblioteca lucide-react
import { ChevronLeft, ChevronRight, MessageSquare, ThumbsUp, Calendar } from "lucide-react";
// Importação do componente Link do Next.js para navegação client-side.
import Link from "next/link";

/**
 * @typedef {'article' | 'tutorial' | 'question' | 'discussion' | 'project'} PostTypeValue
 * Define os tipos possíveis para uma publicação.
 */
type PostTypeValue = 'article' | 'tutorial' | 'question' | 'discussion' | 'project';

/**
 * @typedef {object} Post
 * @property {string} id - Identificador único do post.
 * @property {string} title - Título do post.
 * @property {string} excerpt - Um breve resumo ou trecho do post.
 * @property {string} date - Data formatada da publicação do post.
 * @property {number} comments - Número de comentários no post.
 * @property {number} likes - Número de curtidas/likes no post.
 * @property {PostTypeValue} type - O tipo/categoria do post.
 */
type Post = {
  id: string;
  title: string;
  excerpt: string;
  date: string; // Mantido como string conforme o exemplo
  comments: number;
  likes: number;
  type: PostTypeValue;
};

/**
 * Componente que exibe uma lista paginada dos últimos posts em um Card.
 * Utiliza dados simulados (`allPosts`) para demonstração.
 * Cada post mostra seu tipo (com uma Badge colorida), data, título (linkado),
 * um trecho, e estatísticas (comentários e likes). Inclui controles de paginação.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX que renderiza o card de posts recentes.
 */
export function RecentPosts() {
  // --- Simulação de Dados ---
  // Em uma aplicação real, estes dados viriam de uma API.
  const allPosts: Post[] = [
    {
      id: "post1", // ID para o link
      title: "Introdução ao Next.js 14",
      excerpt: "Aprenda os fundamentos do Next.js 14 e as novas funcionalidades que melhoram a experiência do desenvolvedor e o desempenho da aplicação.", // Trecho do post
      date: "23 Fev 2025", // Data formatada
      comments: 24, // Número de comentários
      likes: 87, // Número de likes
      type: "article" // Tipo do post
    },
    {
      id: "post2",
      title: "Como configurar um projeto com TypeScript",
      excerpt: "Um guia completo para configurar seu projeto Node.js ou frontend utilizando TypeScript, garantindo tipagem estática e maior robustez.",
      date: "19 Fev 2025",
      comments: 18,
      likes: 56,
      type: "tutorial"
    },
    {
      id: "post3",
      title: "Tailwind CSS vs. CSS Modules",
      excerpt: "Comparativo entre duas abordagens populares para estilização em projetos React/Next.js, analisando prós e contras de cada uma.",
      date: "14 Fev 2025",
      comments: 32,
      likes: 104,
      type: "discussion"
    },
    {
      id: "post4",
      title: "Criando uma API REST com Next.js",
      excerpt: "Aprenda a criar rotas de API, lidar com requisições HTTP e conectar ao banco de dados utilizando os Route Handlers do Next.js.",
      date: "10 Fev 2025",
      comments: 15,
      likes: 73,
      type: "tutorial"
    },
    {
      id: "post5",
      title: "Como otimizar o desempenho do seu site Next.js",
      excerpt: "Dicas e truques para melhorar a performance da sua aplicação Next.js, incluindo otimização de imagens, code splitting e server components.",
      date: "05 Fev 2025",
      comments: 20,
      likes: 91,
      type: "article"
    },
     // Adicione mais posts simulados se necessário
  ];
  // --- Fim da Simulação de Dados ---

  // Estado para controlar a página atual da paginação. Inicia na página 1.
  const [currentPage, setCurrentPage] = useState(1);
  // Define quantos posts serão exibidos por página.
  const postsPerPage = 3;

  // --- Lógica de Paginação ---
  // Calcula o índice do último post na página atual.
  const indexOfLastPost = currentPage * postsPerPage;
  // Calcula o índice do primeiro post na página atual.
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // Extrai (fatia) os posts que devem ser exibidos na página atual do array completo.
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  // Calcula o número total de páginas necessárias para exibir todos os posts.
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  // --- Funções de Navegação ---
  /** Navega para a próxima página, limitado pelo número total de páginas. */
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  /** Navega para a página anterior, limitado à página 1. */
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  /**
   * Retorna a variante (cor/estilo) da Badge com base no tipo do post.
   * Mapeia cada `PostTypeValue` para uma variante de Badge pré-definida.
   * @param {PostTypeValue} type - O tipo do post.
   * @returns {('default' | 'secondary' | 'destructive' | 'outline')} A variante da Badge correspondente.
   */
  const getBadgeVariant = (type: Post["type"]): ('default' | 'secondary' | 'destructive' | 'outline') => {
    switch (type) {
      case "article": return "default";     // Cor padrão (geralmente primária)
      case "tutorial": return "secondary";  // Cor secundária
      case "question": return "destructive"; // Cor de destaque/erro (vermelho)
      case "discussion": return "outline";   // Badge com contorno
      case "project": return "default";      // Pode usar a mesma que artigo ou outra
      default: return "default";             // Fallback
    }
  };

  // --- Renderização do Componente ---
  return (
    // O Card principal que envolve todo o conteúdo. `h-full` tenta ocupar a altura disponível.
    <Card className="h-full flex flex-col"> {/* Adicionado flex flex-col para melhor controle da altura */}
      <CardHeader className="pb-3 flex-shrink-0"> {/* Impede que o header encolha */}
        <CardTitle className="text-xl font-semibold">Últimos Posts</CardTitle>
      </CardHeader>
       {/* Conteúdo do Card, permitindo scroll interno se necessário */}
      <CardContent className="flex-grow overflow-y-auto space-y-4"> {/* Permite scroll e adiciona espaçamento */}
        {/* Mapeia os posts da página atual para renderizar cada um. */}
        {currentPosts.map(post => (
          // Envolve cada post em um Link que leva à página de detalhes do post.
          <Link href={`/posts/${post.id}`} key={post.id} className="block group"> {/* `group` habilita hover em elementos filhos */}
            {/* Container para cada post individual, com efeito hover. */}
            <div className="rounded-lg border p-4 space-y-2 transition-colors group-hover:bg-muted/50"> {/* Efeito hover sutil */}
              {/* Linha superior: Badge de Tipo e Data */}
              <div className="flex items-center justify-between">
                {/* Badge mostrando o tipo do post, com cor baseada na função getBadgeVariant */}
                <Badge variant={getBadgeVariant(post.type)} className="capitalize text-xs"> {/* Capitaliza o tipo */}
                  {post.type}
                </Badge>
                 {/* Data da publicação */}
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  <Calendar className="h-3 w-3 mr-1" />
                  {post.date}
                </div>
              </div>
              {/* Título do Post */}
              <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors"> {/* Muda cor no hover */}
                {post.title}
              </h3>
              {/* Trecho/Excerpt do Post (com limite de linhas) */}
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2" title={post.excerpt}> {/* `line-clamp-2` limita a 2 linhas */}
                {post.excerpt}
              </p>
              {/* Linha inferior: Estatísticas (Comentários e Likes) */}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4 pt-1">
                {/* Contagem de Comentários */}
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {post.comments}
                </div>
                {/* Contagem de Likes */}
                <div className="flex items-center">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  {post.likes}
                </div>
              </div>
            </div>
          </Link>
        ))}
         {/* Mensagem se não houver posts na página atual (ou no total) */}
         {currentPosts.length === 0 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">Nenhuma publicação para exibir.</p>
         )}
      </CardContent>

      {/* Seção de Paginação (fixa na parte inferior do CardContent se houver posts) */}
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