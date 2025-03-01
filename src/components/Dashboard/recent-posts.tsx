"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageSquare, ThumbsUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  comments: number;
  likes: number;
  type: "article" | "tutorial" | "question" | "discussion" | "project";
};

export function RecentPosts() {
  // Simulação de dados de posts
  const allPosts: Post[] = [
    {
      id: "post1",
      title: "Introdução ao Next.js 14",
      excerpt: "Aprenda os fundamentos do Next.js 14 e as novas funcionalidades...",
      date: "23 Fev 2025",
      comments: 24,
      likes: 87,
      type: "article"
    },
    {
      id: "post2",
      title: "Como configurar um projeto com TypeScript",
      excerpt: "Um guia completo para configurar seu projeto utilizando TypeScript...",
      date: "19 Fev 2025",
      comments: 18,
      likes: 56,
      type: "tutorial"
    },
    {
      id: "post3",
      title: "Tailwind CSS vs. CSS Modules",
      excerpt: "Comparativo entre duas abordagens populares para estilização...",
      date: "14 Fev 2025",
      comments: 32,
      likes: 104,
      type: "discussion"
    },
    {
      id: "post4",
      title: "Criando uma API REST com Next.js",
      excerpt: "Aprenda a criar uma API REST completa utilizando o Next.js...",
      date: "10 Fev 2025",
      comments: 15,
      likes: 73,
      type: "tutorial"
    },
    {
      id: "post5",
      title: "Como otimizar o desempenho do seu site Next.js",
      excerpt: "Dicas e truques para melhorar a performance da sua aplicação...",
      date: "05 Fev 2025",
      comments: 20,
      likes: 91,
      type: "article"
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  
  // Cálculo da paginação
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  // Funções para navegação entre páginas
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Função para obter a cor da badge com base no tipo de post
  const getBadgeVariant = (type: Post["type"]) => {
    switch(type) {
      case "article": return "default";
      case "tutorial": return "secondary";
      case "question": return "destructive";
      case "discussion": return "outline";
      case "project": return "default";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Últimos Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentPosts.map(post => (
            <Link href={`/posts/${post.id}`} key={post.id} className="block">
              <div className="rounded-lg border p-4 transition-all hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={getBadgeVariant(post.type)} className="capitalize">
                    {post.type}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {post.date}
                  </div>
                </div>
                <h3 className="font-medium text-lg mb-1">{post.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments}
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.likes}
                  </div>
                </div>
              </div>
            </Link>
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