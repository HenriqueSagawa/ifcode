"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type Comment = {
  id: string;
  postId: string;
  postTitle: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
};

export function RecentComments() {
  // Simulação de dados de comentários
  const allComments: Comment[] = [
    {
      id: "comment1",
      postId: "post1",
      postTitle: "Introdução ao Next.js 14",
      author: {
        name: "Maria Oliveira",
        avatar: "/avatar-maria.png"
      },
      content: "Excelente artigo! Consegui entender perfeitamente as novas funcionalidades do Next.js 14.",
      date: "24 Fev 2025"
    },
    {
      id: "comment2",
      postId: "post2",
      postTitle: "Como configurar um projeto com TypeScript",
      author: {
        name: "Pedro Santos",
        avatar: "/avatar-pedro.png"
      },
      content: "Você poderia explicar melhor a parte de configuração do tsconfig.json?",
      date: "20 Fev 2025"
    },
    {
      id: "comment3",
      postId: "post3",
      postTitle: "Tailwind CSS vs. CSS Modules",
      author: {
        name: "Ana Lima",
        avatar: "/avatar-ana.png"
      },
      content: "Concordo com sua análise. Tenho usado o Tailwind há alguns meses e a produtividade aumentou bastante.",
      date: "15 Fev 2025"
    },
    {
      id: "comment4",
      postId: "post4",
      postTitle: "Criando uma API REST com Next.js",
      author: {
        name: "Carlos Mendes",
        avatar: "/avatar-carlos.png"
      },
      content: "Consegui implementar a API seguindo seu tutorial. Muito obrigado pela ajuda!",
      date: "12 Fev 2025"
    },
    {
      id: "comment5",
      postId: "post5",
      postTitle: "Como otimizar o desempenho do seu site Next.js",
      author: {
        name: "Juliana Costa",
        avatar: "/avatar-juliana.png"
      },
      content: "As dicas de otimização de imagens foram muito úteis. Meu site carrega muito mais rápido agora.",
      date: "07 Fev 2025"
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;
  
  // Cálculo da paginação
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = allComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(allComments.length / commentsPerPage);

  // Funções para navegação entre páginas
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Últimos Comentários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentComments.map(comment => (
            <div key={comment.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <Link href={`/posts/${comment.postId}`} className="text-sm font-medium text-primary hover:underline">
                  {comment.postTitle}
                </Link>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {comment.date}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{comment.content}</p>
              
              <div className="flex items-center mt-2">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{comment.author.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Paginação */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToPrevPage} 
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}