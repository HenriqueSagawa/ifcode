"use client";

import { useState, useEffect, startTransition } from "react";
import { toggleLike, checkIfLiked } from "../_actions/likes.ts";
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

interface PostCardProps {
  post: PostWithAuthor;
  userId: string;
}

export default function PostCard({ post, userId }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(post.likes || 0);


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
    <Card className="bg-black border border-gray-800/50 hover:border-green-500/30 transition-all duration-300 group overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link
            href={`/perfil/${post.author.id}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group/author"
          >
            <Avatar className="w-11 h-11 ring-2 ring-gray-800 group-hover/author:ring-green-500/50 transition-all">
              <AvatarImage src={post.author?.image || "/placeholder.svg"} alt={post.author?.name || "Usuário"} />
              <AvatarFallback className="bg-gray-900 text-green-400 font-semibold text-sm">
                {getAuthorInitials(post.author?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium text-white group-hover/author:text-green-400 transition-colors text-sm">
                {post.author?.name || "Usuário desconhecido"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
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
            <div className="bg-gray-950 rounded-lg p-3 border border-gray-800">
              <code className="text-green-400 text-xs font-mono">{post.codeSnippet}</code>
            </div>
          </div>
        )}

        {/* Images */}
        {post.imagesUrls && post.imagesUrls.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              {post.imagesUrls.slice(0, 4).map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Imagem ${index + 1} do post`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-800"
                  />
                  {index === 3 && post.imagesUrls.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        +{post.imagesUrls.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Language */}
        {post.programmingLanguage && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-gray-900/50 rounded-full px-3 py-1.5 border border-gray-800">
              <AiOutlineCode className="w-3.5 h-3.5 text-green-400" />
              <LanguageIcon language={post.programmingLanguage} className="w-4 h-4" />
              <span className="text-xs text-gray-300 capitalize font-medium">{post.programmingLanguage}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-500 hover:text-red-400 hover:bg-red-400/5 px-3 py-1.5 h-auto rounded-full transition-all"
              onClick={handleToggleLike}
            >
              {liked ? (
                <AiFillHeart className="w-4 h-4 text-red-400" />
              ) : (
                <AiOutlineHeart className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">{likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-blue-400 hover:bg-blue-400/5 px-3 py-1.5 h-auto rounded-full transition-all"
            >
              <AiOutlineMessage className="w-4 h-4 mr-1.5" />
              <span className="text-xs font-medium">Comentar</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-green-400 hover:bg-green-400/5 p-2 h-auto rounded-full transition-all"
          >
            <AiOutlineShareAlt className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
