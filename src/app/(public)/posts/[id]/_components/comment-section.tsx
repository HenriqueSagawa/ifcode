"use client"

import { CommentForm } from "./comment-form"
import { CommentItem } from "./comment-item"

interface CommentWithAuthor {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  userId: string;
  status?: string; // Adicionando suporte ao status
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

interface CommentsSectionProps {
  comments: CommentWithAuthor[];
  onAddComment?: (content: string) => void; // Tornando opcional
  onCommentLike: (commentId: string) => void;
  userImage: string;
  isAuthor?: boolean; // Nova propriedade para identificar se é o autor
}

export const CommentsSection = ({ comments, onAddComment, onCommentLike, userImage, isAuthor = false }: CommentsSectionProps) => {
  // Função para contar comentários por status (opcional - para estatísticas)
  const getCommentsStats = () => {
    const stats = comments.reduce((acc, comment) => {
      const status = comment.status || 'pending'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: comments.length,
      accepted: stats.accepted || 0,
      rejected: stats.rejected || 0,
      pending: stats.pending || 0
    }
  }

  const stats = getCommentsStats()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Comentários ({stats.total})
        </h2>
        
        {/* Estatísticas opcionais dos status (pode ser removido se não desejar) */}
        {(stats.accepted > 0 || stats.rejected > 0 || stats.pending > 0) && (
          <div className="flex items-center gap-4 text-sm">
            {stats.accepted > 0 && (
              <span className="text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                {stats.accepted} aprovados
              </span>
            )}
            {stats.rejected > 0 && (
              <span className="text-red-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                {stats.rejected} rejeitados
              </span>
            )}
            {stats.pending > 0 && (
              <span className="text-yellow-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                {stats.pending} pendentes
              </span>
            )}
          </div>
        )}
      </div>

      {/* Add Comment - Só exibe se não for o autor e se onAddComment foi fornecido */}
      {!isAuthor && onAddComment && (
        <CommentForm userImage={userImage} onAddComment={onAddComment} />
      )}

      {/* Mensagem para o autor */}
      {isAuthor && (
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <span className="text-lg">👤</span>
            <span className="font-medium">Modo Autor</span>
          </div>
          <p className="text-blue-300/80 text-sm">
            Como autor deste post, você pode visualizar e moderar todos os comentários, mas não pode adicionar novos comentários.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onLike={onCommentLike} />
        ))}
        
        {/* Mensagem quando não há comentários */}
        {comments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Nenhum comentário ainda</div>
            <div className="text-gray-500 text-sm">Seja o primeiro a comentar!</div>
          </div>
        )}
      </div>
    </div>
  )
}