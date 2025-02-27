// components/dashboard/recent-activity.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Heart, MessageSquare } from "lucide-react";

// Dados de exemplo - em um ambiente real, viriam da API
const recentPosts = [
  {
    id: 'post-1',
    title: 'Introdução ao Next.js 14 e App Router',
    excerpt: 'Neste artigo, exploraremos os recursos do novo App Router no Next.js 14 e como ele melhora a experiência de desenvolvimento.',
    date: '22 Fev 2025',
    likes: 28,
    comments: 12,
  },
  {
    id: 'post-2',
    title: 'Configurando Tailwind CSS com TypeScript',
    excerpt: 'Aprenda a configurar e utilizar o Tailwind CSS em projetos TypeScript para criar interfaces modernas e responsivas.',
    date: '15 Fev 2025',
    likes: 42,
    comments: 9,
  },
  {
    id: 'post-3',
    title: 'Componentes UI Reutilizáveis com Shadcn/ui',
    excerpt: 'Como criar uma biblioteca de componentes consistente para seus projetos usando Shadcn/ui e Tailwind CSS.',
    date: '08 Fev 2025',
    likes: 35,
    comments: 15,
  },
  {
    id: 'post-4',
    title: 'Autenticação em Next.js com NextAuth',
    excerpt: 'Implementando autenticação completa em aplicações Next.js usando NextAuth e estratégias de persistência.',
    date: '01 Fev 2025',
    likes: 54,
    comments: 23,
  },
];

const recentComments = [
  {
    id: 'comment-1',
    postId: 'post-2',
    postTitle: 'Configurando Tailwind CSS com TypeScript',
    content: 'Excelente tutorial! Consegui implementar na minha aplicação sem problemas.',
    author: {
      name: 'Maria Souza',
      avatar: '/api/placeholder/32/32',
    },
    date: '24 Fev 2025',
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    postTitle: 'Introdução ao Next.js 14 e App Router',
    content: 'Você poderia explicar melhor a diferença entre o Pages Router e App Router? Ainda estou confuso sobre quando usar cada um.',
    author: {
      name: 'Pedro Oliveira',
      avatar: '/api/placeholder/32/32',
    },
    date: '23 Fev 2025',
  },
  {
    id: 'comment-3',
    postId: 'post-3',
    postTitle: 'Componentes UI Reutilizáveis com Shadcn/ui',
    content: 'Shadcn/ui realmente facilitou muito o desenvolvimento das minhas interfaces. Valeu pela dica!',
    author: {
      name: 'Ana Ferreira',
      avatar: '/api/placeholder/32/32',
    },
    date: '20 Fev 2025',
  },
  {
    id: 'comment-4',
    postId: 'post-4',
    postTitle: 'Autenticação em Next.js com NextAuth',
    content: 'Encontrei um problema ao integrar com o Google OAuth. Alguém pode me ajudar?',
    author: {
      name: 'Lucas Santos',
      avatar: '/api/placeholder/32/32',
    },
    date: '18 Fev 2025',
  },
];

export function RecentActivity() {
  const [postsPage, setPostsPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);
  const itemsPerPage = 2;
  
  const totalPostPages = Math.ceil(recentPosts.length / itemsPerPage);
  const totalCommentPages = Math.ceil(recentComments.length / itemsPerPage);
  
  const paginatedPosts = recentPosts.slice(
    (postsPage - 1) * itemsPerPage,
    postsPage * itemsPerPage
  );
  
  const paginatedComments = recentComments.slice(
    (commentsPage - 1) * itemsPerPage,
    commentsPage * itemsPerPage
  );

  // Componente para renderizar a lista de posts
  const PostsList = () => (
    <>
      {paginatedPosts.map((post) => (
        <div key={post.id} className="border rounded-lg p-4">
          <Link href={`/posts/${post.id}`} className="block hover:underline">
            <h3 className="font-medium text-lg">{post.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">{post.excerpt}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-muted-foreground">{post.date}</span>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-red-500" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                {post.comments}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      <Pagination 
        currentPage={postsPage}
        totalPages={totalPostPages}
        onPageChange={setPostsPage}
      />
    </>
  );

  // Componente para renderizar a lista de comentários
  const CommentsList = () => (
    <>
      {paginatedComments.map((comment) => (
        <div key={comment.id} className="border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">{comment.author.name}</h4>
                <span className="text-xs text-muted-foreground">{comment.date}</span>
              </div>
              <Link 
                href={`/posts/${comment.postId}`}
                className="text-xs text-muted-foreground hover:underline"
              >
                em: {comment.postTitle}
              </Link>
              <p className="text-sm mt-2">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
      
      <Pagination 
        currentPage={commentsPage}
        totalPages={totalCommentPages}
        onPageChange={setCommentsPage}
      />
    </>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Publicações Recentes</TabsTrigger>
            <TabsTrigger value="comments">Comentários Recentes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            <PostsList />
          </TabsContent>
          
          <TabsContent value="comments" className="space-y-4">
            <CommentsList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <span className="text-sm">
        Página {currentPage} de {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}