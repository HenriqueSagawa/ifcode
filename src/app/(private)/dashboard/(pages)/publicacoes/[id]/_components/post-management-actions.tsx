"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { archivePost } from "../../_actions/archive-post"
import { unarchivePost } from "../../_actions/unarchive-post"
import { deletePost } from "../../_actions/delete-post"
import { addToast } from "@heroui/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Archive, Trash2, Calendar, User, Tag, Code, Image } from "lucide-react"
import type { PostProps } from "@/types/posts"

interface PostManagementActionsProps {
  post: PostProps
  onPostUpdate: (post: PostProps) => void
}

export function PostManagementActions({ post, onPostUpdate }: PostManagementActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleArchive = async () => {
    setLoading(true)
    try {
      const result = await archivePost(post.id!)
      if (result.success) {
        onPostUpdate({ ...post, status: "archived" })
        addToast({
          title: "Sucesso",
          description: "Post arquivado com sucesso!",
          color: "success",
          variant: "solid"
        })
      } else {
        addToast({
          title: "Erro",
          description: result.message,
          color: "danger",
          variant: "solid"
        })
      }
    } catch (error) {
      console.error("Erro ao arquivar post:", error)
      addToast({
        title: "Erro",
        description: "Erro ao arquivar post. Tente novamente.",
        color: "danger",
        variant: "solid"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnarchive = async () => {
    setLoading(true)
    try {
      const result = await unarchivePost(post.id!)
      if (result.success) {
        onPostUpdate({ ...post, status: "published" })
        addToast({
          title: "Sucesso",
          description: "Post desarquivado com sucesso!",
          color: "success",
          variant: "solid"
        })
      } else {
        addToast({
          title: "Erro",
          description: result.message,
          color: "danger",
          variant: "solid"
        })
      }
    } catch (error) {
      console.error("Erro ao desarquivar post:", error)
      addToast({
        title: "Erro",
        description: "Erro ao desarquivar post. Tente novamente.",
        color: "danger",
        variant: "solid"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deletePost(post.id!)
      if (result.success) {
        addToast({
          title: "Sucesso",
          description: "Post deletado com sucesso!",
          color: "success",
          variant: "solid"
        })
        router.push("/dashboard/publicacoes")
      } else {
        addToast({
          title: "Erro",
          description: result.message,
          color: "danger",
          variant: "solid"
        })
      }
    } catch (error) {
      console.error("Erro ao deletar post:", error)
      addToast({
        title: "Erro",
        description: "Erro ao deletar post. Tente novamente.",
        color: "danger",
        variant: "solid"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-yellow-100 text-yellow-800"
      case "deleted":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publicado"
      case "archived":
        return "Arquivado"
      case "deleted":
        return "Deletado"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Informações do post */}
      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Criado: {new Date(post.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Atualizado: {new Date(post.updatedAt).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Tipo: {post.type}</span>
          </div>

          {post.programmingLanguage && (
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Linguagem: {post.programmingLanguage}</span>
            </div>
          )}

          {post.imagesUrls && post.imagesUrls.length > 0 && (
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{post.imagesUrls.length} imagem(ns)</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge className={getStatusColor(post.status)}>
              {getStatusLabel(post.status)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Ações de gerenciamento */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {post.status === "published" && (
            <Button
              variant="outline"
              onClick={handleArchive}
              disabled={loading}
              className="w-full"
            >
              <Archive className="h-4 w-4 mr-2" />
              {loading ? "Arquivando..." : "Arquivar Post"}
            </Button>
          )}

          {post.status === "archived" && (
            <Button
              variant="outline"
              onClick={handleUnarchive}
              disabled={loading}
              className="w-full"
            >
              <Archive className="h-4 w-4 mr-2" />
              {loading ? "Desarquivando..." : "Desarquivar Post"}
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={loading}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar Post
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.
                  O post será marcado como deletado e não aparecerá mais na sua lista de publicações.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sim, deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
