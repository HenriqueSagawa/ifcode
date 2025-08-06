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
      }
      
      addOptimisticComment(optimisticCommentData)
      

      const newComment = await addComment(postId, content, userId)
      
      if (!newComment) {
        throw new Error('Falha ao adicionar comentário')
      }

      
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
    }
  }

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
        
        <CommentsSection
        userImage={userImage}
          comments={optimisticComments}
          onAddComment={handleAddComment}
          onCommentLike={handleCommentLike}
        />
      </div>
    </div>
  )
}