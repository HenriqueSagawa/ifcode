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
  
  const getStatusStyles = () => {
    switch (post.status) {
      case "archived":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
      case "deleted":
        return "border-red-500 bg-red-50 dark:bg-red-950/20"
      default:
        return "border-zinc-700"
    }
  }

  return (
    <div className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded ${getStatusStyles()}`}>
      <div className="flex-shrink-0">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-2">
          <h3 className="text-xs sm:text-sm font-medium truncate">{post.title}</h3>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Badge variant="secondary" className="text-xs">{postTypeLabels[post.type]}</Badge>
            {post.programmingLanguage && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <LanguageIcon language={post.programmingLanguage} />
                {post.programmingLanguage.charAt(0).toUpperCase() + post.programmingLanguage.slice(1)}
              </Badge>
            )}
            {post.status === "archived" && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
                Arquivado
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
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
            <span className="hidden sm:inline">{new Date(post.createdAt).toLocaleDateString("pt-BR")}</span>
            <span className="sm:hidden">{new Date(post.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
