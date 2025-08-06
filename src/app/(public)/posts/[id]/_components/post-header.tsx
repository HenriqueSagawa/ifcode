"use client"

import { startTransition, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShareAlt,
  AiOutlineCalendar,
  AiOutlineCode,
  AiOutlineArrowLeft,
  AiOutlineEye,
  AiFillHeart,
} from "react-icons/ai"
import { LanguageIcon } from "../../_components/language-icons"
import { checkIfLiked, toggleLike } from "../../_actions/likes.ts"
import { addToast } from "@heroui/toast"

interface PostWithAuthor {
  id?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  type: "article" | "question" | "project" | "tutorial" | "discussion";
  programmingLanguage: string;
  codeSnippet: string;
  imagesUrls: string[];
  likes: number;
  userId: string;
  status: "published" | "archived" | "deleted";
  author: {
    id?: string;
    name: string;
    email: string;
    image?: string;
    bio?: string;
    birthDate?: string;
    createdAt?: string;
    github?: string;
    phone?: string;
    bannerImage?: string;
    fullData?: any;
    skills?: string[];
  };
}

interface PostHeaderProps {
  post: PostWithAuthor;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  userId: string
}

export const PostHeader = ({
  post,
  isLiked: initialIsLiked,
  likesCount: initialLikesCount,
  commentsCount,
  onLike,
  userId
}: PostHeaderProps) => {
  const router = useRouter()

  // Estados locais
  const [liked, setLiked] = useState(initialIsLiked);
  const [likesCountState, setLikesCountState] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLike, setIsCheckingLike] = useState(true);

  // Verificar se está curtido na montagem do componente
  useEffect(() => {
    async function checkLike() {
      if (!userId || !post.id) {
        setIsCheckingLike(false);
        return;
      }

      try {
        const hasLiked = await checkIfLiked(post.id, userId);
        setLiked(hasLiked);
      } catch (error) {
        console.error("Erro ao verificar curtida:", error);
      } finally {
        setIsCheckingLike(false);
      }
    }

    checkLike();
  }, [post.id, userId]);

  // Sincronizar com as props quando elas mudarem (mas não sobrescrever o estado já verificado)
  useEffect(() => {
    if (!isCheckingLike) {
      setLikesCountState(initialLikesCount);
    }
  }, [initialLikesCount, isCheckingLike]);

  const handleToggleLike = async () => {
    if (!userId) {
      addToast({
        title: "Atenção",
        description: "Você precisa estar logado para curtir posts.",
        color: "warning",
      })
      return;
    }

    if (isLoading || !post.id) {
      return;
    }

    setIsLoading(true);

    // Atualização otimista da UI
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCountState(prev => prev + (!wasLiked ? 1 : -1));

    try {
      const result = await toggleLike(post.id, userId);
      
      // Verificar se o resultado está em sync com o estado otimista
      if (result.liked !== !wasLiked) {
        setLiked(result.liked);
        setLikesCountState(prev => prev + (result.liked !== !wasLiked ? (result.liked ? 2 : -2) : 0));
      }
      
      // Notificar o componente pai
      onLike();
      
    } catch (error) {
      // Reverter em caso de erro
      setLiked(wasLiked);
      setLikesCountState(prev => prev + (wasLiked ? 1 : -1));
      
      addToast({
        title: "Erro",
        description: "Não foi possível curtir o post. Tente novamente.",
        color: "danger",
      });
      
      console.error("Erro ao curtir post:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPostTypeColor = (type: string) => {
    const colors = {
      tutorial: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      article: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      question: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      discussion: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      project: "bg-green-500/10 text-green-400 border-green-500/20",
    }
    return colors[type as keyof typeof colors] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }

  const getPostTypeLabel = (type: string) => {
    const labels = {
      tutorial: "Tutorial",
      article: "Artigo",
      question: "Pergunta",
      discussion: "Discussão",
      project: "Projeto",
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <>
      {/* Header Navigation */}
      <header className="border-b border-green-900/20 bg-black/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-green-400 hover:bg-green-400/10"
            >
              <AiOutlineArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-bold text-green-400">IFCode</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Post Header */}
      <div className="mb-8 mt-10 container max-w-[900px] mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group/author"
            >
              <Avatar className="w-12 h-12 ring-2 ring-gray-800 group-hover/author:ring-green-500/50 transition-all">
                <AvatarImage src={post.author.image || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback className="bg-gray-900 text-green-400 font-semibold">
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-medium text-white group-hover/author:text-green-400 transition-colors">
                  {post.author.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <AiOutlineCalendar className="w-4 h-4" />
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`${getPostTypeColor(post.type)} font-medium px-3 py-1`}>
              {getPostTypeLabel(post.type)}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{post.title}</h1>

        {/* Language */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2 bg-gray-900/50 rounded-full px-4 py-2 border border-gray-800">
            <AiOutlineCode className="w-4 h-4 text-green-400" />
            <LanguageIcon language={post.programmingLanguage} className="w-5 h-5" />
            <span className="text-sm text-gray-300 capitalize font-medium">{post.programmingLanguage}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleLike}
            disabled={isLoading || isCheckingLike}
            className={`${liked
                ? "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                : "text-gray-400 hover:text-red-400 hover:bg-red-400/10"
              } transition-all ${(isLoading || isCheckingLike) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {liked ? <AiFillHeart className="w-5 h-5 mr-2 text-red-500" /> : <AiOutlineHeart className="w-5 h-5 mr-2" />}
            {isCheckingLike ? "..." : likesCountState}
          </Button>

          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10">
            <AiOutlineMessage className="w-5 h-5 mr-2" />
            {commentsCount} comentários
          </Button>

          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 hover:bg-green-400/10">
            <AiOutlineShareAlt className="w-5 h-5 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>
    </>
  )
}