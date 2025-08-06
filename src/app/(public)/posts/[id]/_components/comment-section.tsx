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
  onAddComment: (content: string) => void;
  onCommentLike: (commentId: string) => void;
  userImage: string;
}

export const CommentsSection = ({ comments, onAddComment, onCommentLike, userImage }: CommentsSectionProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Comentários ({comments.length})</h2>

      {/* Add Comment */}
      <CommentForm userImage={userImage} onAddComment={onAddComment} />

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onLike={onCommentLike} />
        ))}
      </div>
    </div>
  )
}