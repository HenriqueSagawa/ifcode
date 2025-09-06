"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AiOutlineHeart, AiOutlineMessage, AiFillHeart } from "react-icons/ai"
import { ReportButton } from "@/components/ReportButton"
import { hasUserReportedContent } from "@/actions/reports"
import { useEffect, useState } from "react"

interface CommentWithAuthor {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  userId: string;
  status?: string; // Adicionando a propriedade status
  author?: {
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

interface CommentItemProps {
  comment: CommentWithAuthor;
  onLike: (commentId: string) => void;
  userId?: string;
}

export const CommentItem = ({ comment, onLike, userId }: CommentItemProps) => {
  const [hasReported, setHasReported] = useState(false);

  useEffect(() => {
    async function checkReport() {
      if (!userId) {
        return;
      }
      const reported = await hasUserReportedContent(comment.id);
      setHasReported(reported);
    }
    checkReport();
  }, [comment.id, userId]);
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Agora há pouco"
    if (diffInHours < 24) return `${diffInHours}h atrás`
    if (diffInHours < 48) return "1 dia atrás"
    return `${Math.floor(diffInHours / 24)} dias atrás`
  }

  // Função para obter a mensagem de status do comentário
  const getCommentStatusMessage = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'Aprovado pelo usuário'
      case 'rejected':
        return 'Rejeitado pelo autor'
      case 'pending':
        return 'Aguardando aprovação'
      default:
        return null
    }
  }

  // Função para obter a cor da mensagem de status
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'rejected':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  // Função para obter o ícone do status
  const getStatusIndicator = (status?: string) => {
    switch (status) {
      case 'accepted':
        return '✓'
      case 'rejected':
        return '✗'
      case 'pending':
        return '⏳'
      default:
        return null
    }
  }

  const statusMessage = getCommentStatusMessage(comment.status)
  const statusColor = getStatusColor(comment.status)
  const statusIndicator = getStatusIndicator(comment.status)

  return (
    <div className="bg-gray-900/30 rounded-lg border border-gray-800/50 p-6 hover:bg-gray-900/50 transition-colors">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10 ring-2 ring-gray-700 flex-shrink-0">
          <AvatarImage src={comment.author?.image} alt={comment.author?.name} />
          <AvatarFallback className="bg-gray-800 text-green-400 font-semibold text-sm">
            {comment.author?.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-white">{comment.author?.name}</span>
            <span className="text-sm text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
            
            {/* Status do comentário */}
            {statusMessage && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                {statusIndicator && <span className="text-xs">{statusIndicator}</span>}
                <span>{statusMessage}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-300 leading-relaxed mb-4">{comment.content}</p>
          
          {/* Barra de status visual (opcional - para destacar ainda mais) */}
          {comment.status && comment.status !== 'pending' && (
            <div className={`w-full h-0.5 mb-3 rounded-full ${
              comment.status === 'accepted' ? 'bg-green-400/30' : 'bg-red-400/30'
            }`} />
          )}
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(comment.id)}
              className={`${
                comment.isLiked
                  ? "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  : "text-gray-500 hover:text-red-400 hover:bg-red-400/10"
              } px-3 py-1.5 h-auto text-sm transition-all`}
            >
              {comment.isLiked ? (
                <AiFillHeart className="w-4 h-4 mr-1.5" />
              ) : (
                <AiOutlineHeart className="w-4 h-4 mr-1.5" />
              )}
              {comment.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 px-3 py-1.5 h-auto text-sm transition-all"
            >
              <AiOutlineMessage className="w-4 h-4 mr-1.5" />
              Responder
            </Button>
            
            {userId && (
              <ReportButton
                contentId={comment.id}
                contentType="comment"
                hasReported={hasReported}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 px-3 py-1.5 h-auto text-sm transition-all"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}