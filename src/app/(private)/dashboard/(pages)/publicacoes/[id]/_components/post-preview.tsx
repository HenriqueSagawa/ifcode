import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, MessageCircle, Eye, Code, Image } from "lucide-react"
import { LanguageIcon } from "../../_components/language-icons"
import type { PostProps } from "@/types/posts"

interface PostPreviewProps {
  post: PostProps
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Informações do post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Conteúdo do Post</span>
            <Badge variant="outline">{post.type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </div>
        </CardContent>
      </Card>

      {/* Code snippet */}
      {post.codeSnippet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Código
              <Badge variant="outline" className="flex items-center gap-1">
                <LanguageIcon language={post.programmingLanguage} />
                {post.programmingLanguage}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{post.codeSnippet}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Imagens */}
      {post.imagesUrls && post.imagesUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Imagens ({post.imagesUrls.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.imagesUrls.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm">{post.likes} curtidas</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">0 comentários</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              <span className="text-sm">0 visualizações</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm">
                {new Date(post.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
