"use client"

import { useState, useOptimistic } from "react"
import { useParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { PostHeader } from "./post-header"
import { PostContent } from "./post-content"
import { CommentsSection } from "./comment-section"
import { addComment } from "../_actions/post-actions"
import type { PostProps, Comment } from "@/types/posts"
import type { User } from "../../../../../../types/next-auth"

interface PostWithAuthor extends PostProps {
  author: User;
}

interface PostPageContentProps {
  initialPost: PostWithAuthor;
  initialComments: (Comment)[];
  postId: string;
  userId: string;
  userImage: string;
}

export default function PostPageContent({ 
  initialPost, 
  initialComments, 
  postId,
  userId,
  userImage
}: PostPageContentProps) {
  const [post, setPost] = useState(initialPost)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialPost.likes)
  
  // Optimistic updates para comentários
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newComment: Comment) => [newComment, ...state]
  )

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleCommentLike = (commentId: string) => {
    // TODO: Implementar lógica para curtir comentário
    console.log('Curtir comentário:', commentId)
  }

  const handleAuthorClick = () => {
    console.log("Navigate to profile:", post.author.id)
    // TODO: Implementar navegação para perfil
  }

  const handleAddComment = async (content: string) => {
    try {
      const optimisticCommentData: Comment = {
        id: `temp-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        userId: userId,
        status: "pending" // Comentários novos começam como pendentes
      }
      
      addOptimisticComment(optimisticCommentData)
      

      const newComment = await addComment(postId, content, userId)
      
      if (!newComment) {
        throw new Error('Falha ao adicionar comentário')
      }

      
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
      // Mostrar mensagem de erro amigável para o usuário
      if (error instanceof Error && error.message.includes('suspenso')) {
        alert(`❌ ${error.message}`)
      } else {
        alert('❌ Erro ao adicionar comentário. Tente novamente.')
      }
    }
  }

  // Verificar se o usuário atual é o autor do post
  const isAuthor = userId === post.author.id

  return (
    <div className="min-h-screen bg-black text-white">
      <PostHeader
        post={post}
        isLiked={isLiked}
        likesCount={likesCount}
        commentsCount={optimisticComments.length}
        onLike={handleLike}
        userId={userId}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PostContent post={post} />
        
        <Separator className="bg-gray-800 mb-8" />
        
        {/* Mensagem para autor do post */}
        {isAuthor && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">Você é o autor deste post</span>
            </div>
            <p className="text-yellow-300/80 text-sm mt-1">
              Como autor, você não pode comentar no seu próprio post, mas pode visualizar e moderar os comentários dos outros usuários.
            </p>
          </div>
        )}
        
        <CommentsSection
          userImage={userImage}
          comments={optimisticComments}
          onAddComment={isAuthor ? undefined : handleAddComment}
          onCommentLike={handleCommentLike}
          isAuthor={isAuthor}
        />
      </div>
    </div>
  )
}