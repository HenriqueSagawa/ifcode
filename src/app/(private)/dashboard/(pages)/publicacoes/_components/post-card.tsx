import { Badge } from "@/components/ui/badge"
import { Eye, Heart, MessageCircle, Calendar, FileText, MessageSquare, Code, BookOpen, Users } from "lucide-react"
import { LanguageIcon } from "./language-icons"
import type { PostProps } from "@/types/posts"
import { postTypeLabels } from "@/constants/technologies"

interface PostCardProps {
  post: PostProps
}

const postTypeIcons = {
  article: FileText,
  question: MessageSquare,
  project: Code,
  tutorial: BookOpen,
  discussion: Users,
}

export function PostCard({ post }: PostCardProps) {
  const Icon = postTypeIcons[post.type]

  return (
    <div className="flex items-start space-x-4 p-4 border rounded border-zinc-700">
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="text-sm font-medium truncate">{post.title}</h3>
          <Badge variant="secondary">{postTypeLabels[post.type]}</Badge>
          {post.programmingLanguage && (
            <Badge variant="outline" className="flex items-center gap-1">
              <LanguageIcon language={post.programmingLanguage} />
              {post.programmingLanguage.charAt(0).toUpperCase() + post.programmingLanguage.slice(1)}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>12</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-3 w-3" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-3 w-3" />
            <span>12</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(post.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
