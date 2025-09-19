"use client";

import { useState, useEffect, startTransition } from "react";
import { toggleLike, checkIfLiked } from "../_actions/likes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineMessage,
  AiOutlineShareAlt,
  AiOutlineLock,
  AiOutlineCode,
} from "react-icons/ai";
import { LanguageIcon } from "./language-icons";
import { PostWithAuthor } from "../_actions/get-posts";
import { getRelativeTime } from "../_actions/format-date";
import { addToast } from "@heroui/toast";
import Link from "next/link";
import { ReportButton } from "@/components/ReportButton";
import { hasUserReportedContent } from "@/actions/reports";
// removido Dialog para usar o mesmo modal simples da página do post

interface PostCardProps {
  post: PostWithAuthor;
  userId: string;
}

export default function PostCard({ post, userId }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [hasReported, setHasReported] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);


  useEffect(() => {
    async function checkLike() {
      if (!userId) {
        return;
      }
      const hasLiked = await checkIfLiked(post.id as string, userId);
      setLiked(hasLiked);
      setLoading(false);
    }
    checkLike();
  }, [post.id, userId]);

  useEffect(() => {
    async function checkReport() {
      if (!userId) {
        return;
      }
      const reported = await hasUserReportedContent(post.id as string);
      setHasReported(reported);
    }
    checkReport();
  }, [post.id, userId]);

  const handleToggleLike = () => {
    if (!userId) {
      addToast({
        title: "Atenção",
        description: "Você precisa estar logado para curtir posts.",
        color: "warning",
      })
      return;
    };


    startTransition(async () => {
      const result = await toggleLike(post.id as string, userId);
      setLiked(result.liked);
      setLikesCount((prev) => prev + (result.liked ? 1 : -1));
    });
  };

  const getPostTypeColor = (type: string) => {
    const colors = {
      tutorial: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      artigo: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      pergunta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      discussao: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      projeto: "bg-green-500/10 text-green-400 border-green-500/20",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const getPostTypeLabel = (type: string) => {
    const labels = {
      tutorial: "Tutorial",
      artigo: "Artigo",
      pergunta: "Pergunta",
      discussao: "Discussão",
      projeto: "Projeto",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getAuthorInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="bg-muted dark:bg-zinc-950 border-gray-700 hover:border-green-500/30 transition-all duration-300 group overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link
            href={`/perfil/${post.author.id}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group/author"
          >
            <Avatar className="w-11 h-11 ring-2 ring-border group-hover/author:ring-green-500/50 transition-all">
              <AvatarImage src={post.author?.image || "/placeholder.svg"} alt={post.author?.name || "Usuário"} />
              <AvatarFallback className="bg-muted text-green-600 font-semibold text-sm">
                {getAuthorInitials(post.author?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium group-hover/author:text-green-600 transition-colors text-sm">
                {post.author?.name || "Usuário desconhecido"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <AiOutlineLock className="w-3 h-3" />
                {getRelativeTime(post.createdAt)}
              </div>
            </div>
          </Link>

          <Badge variant="outline" className={`${getPostTypeColor(post.type)} text-xs font-medium px-2.5 py-1`}>
            {getPostTypeLabel(post.type)}
          </Badge>
        </div>

        {/* Content */}
        <Link href={`/posts/${post.id}`} className="text-left w-full group/content mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover/content:text-green-400 transition-colors leading-tight">
            {post.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{post.content}</p>
        </Link>

        {/* Code Snippet Preview */}
        {post.codeSnippet && (
          <div className="mb-4">
            <div className="bg-muted rounded-lg p-3 border border-gray-700">
              <code className="text-xs font-mono">{post.codeSnippet}</code>
            </div>
          </div>
        )}

        {/* Images */}
        {post.imagesUrls && post.imagesUrls.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {post.imagesUrls.slice(0, 4).map((imageUrl, index) => (
                <button
                  key={index}
                  type="button"
                  className="relative group/image cursor-zoom-in focus:outline-none"
                  onClick={() => {
                    setActiveImageIndex(index);
                    setIsImageOpen(true);
                    setIsClosing(false);
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`Imagem ${index + 1} do post`
                    }
                    className="w-full h-24 object-cover rounded-lg border border-gray-800"
                  />
                  {index === 3 && post.imagesUrls.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        +{post.imagesUrls.length - 4}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {isImageOpen && (
              <div
                className={`fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 ${isClosing ? 'ifc-modal-overlay-animate-out' : 'ifc-modal-overlay-animate'}`}
                onClick={() => {
                  setIsClosing(true);
                  setTimeout(() => setIsImageOpen(false), 160);
                }}
                role="dialog"
                aria-modal="true"
              >
                <div className={`relative max-w-5xl w-full max-h-[90vh] ${isClosing ? 'ifc-modal-content-animate-out' : 'ifc-modal-content-animate'}`} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur"
                    onClick={() => {
                      setIsClosing(true);
                      setTimeout(() => setIsImageOpen(false), 160);
                    }}
                    aria-label="Fechar imagem"
                  >
                    ✕
                  </button>

                  <img
                    src={post.imagesUrls[activeImageIndex]}
                    alt={`Imagem ampliada ${activeImageIndex + 1} do post`}
                    className="w-full h-auto max-h-[90vh] object-contain rounded"
                  />

                  {post.imagesUrls.length > 1 && (
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
                      <button
                        type="button"
                        className="bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={() => setActiveImageIndex((prev) => (prev - 1 + post.imagesUrls.length) % post.imagesUrls.length)}
                        aria-label="Imagem anterior"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={() => setActiveImageIndex((prev) => (prev + 1) % post.imagesUrls.length)}
                        aria-label="Próxima imagem"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Language */}
        {post.programmingLanguage && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-gray-900/50 rounded-full px-3 py-1.5 border border-gray-800">
              <AiOutlineCode className="w-3.5 h-3.5 text-green-400" />
              <LanguageIcon language={post.programmingLanguage} className="w-4 h-4" />
              <span className="text-xs capitalize font-medium">{post.programmingLanguage}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 px-3 py-1.5 h-auto rounded-full transition-all"
              onClick={handleToggleLike}
            >
              {liked ? (
                <AiFillHeart className="w-4 h-4 text-red-500" />
              ) : (
                <AiOutlineHeart className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">{likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-blue-500 hover:bg-blue-500/5 px-3 py-1.5 h-auto rounded-full transition-all"
            >
              <AiOutlineMessage className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-medium">Comentar</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-green-600 hover:bg-green-600/5 p-2 h-auto rounded-full transition-all"
            >
              <AiOutlineShareAlt className="w-4 h-4" />
            </Button>
            
            {userId && (
              <ReportButton
                contentId={post.id as string}
                contentType="post"
                hasReported={hasReported}
                variant="ghost"
                size="sm"
                className="p-2 h-auto rounded-full"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
