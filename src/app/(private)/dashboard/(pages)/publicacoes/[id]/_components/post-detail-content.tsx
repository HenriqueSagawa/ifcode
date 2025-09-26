"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PostEditForm } from "./post-edit-form"
import { PostManagementActions } from "./post-management-actions"
import { PostPreview } from "./post-preview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Eye } from "lucide-react"
import type { PostProps } from "@/types/posts"

interface PostDetailContentProps {
  post: PostProps
}

export function PostDetailContent({ post: initialPost }: PostDetailContentProps) {
  const [post, setPost] = useState<PostProps>(initialPost)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const handlePostUpdate = (updatedPost: PostProps) => {
    setPost(updatedPost)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/dashboard/publicacoes")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Publicações
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{post.type}</Badge>
                <Badge variant="outline">{post.programmingLanguage}</Badge>
                <Badge variant={post.status === "published" ? "default" : "destructive"}>
                  {post.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditing ? "Visualizar" : "Editar"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <PostEditForm 
                post={post} 
                onPostUpdate={handlePostUpdate}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <PostPreview post={post} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PostManagementActions post={post} onPostUpdate={handlePostUpdate} />
          </div>
        </div>
      </div>
    </div>
  )
}
