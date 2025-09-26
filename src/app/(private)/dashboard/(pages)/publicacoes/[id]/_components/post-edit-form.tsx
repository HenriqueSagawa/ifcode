"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updatePost } from "../../_actions/update-post"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Save, XCircle } from "lucide-react"
import { postTypeLabels } from "@/constants/technologies"
import { TechnologySelect } from "../../_components/technology-select"
import { addToast } from "@heroui/toast"
import type { PostProps } from "@/types/posts"

interface PostEditFormProps {
  post: PostProps
  onPostUpdate: (post: PostProps) => void
  onCancel: () => void
}

export function PostEditForm({ post, onPostUpdate, onCancel }: PostEditFormProps) {
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    type: post.type,
    programmingLanguage: post.programmingLanguage,
    codeSnippet: post.codeSnippet,
    imagesUrls: post.imagesUrls || []
  })
  
  const [loading, setLoading] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updatePost(post.id!, formData)
      
      if (result.success) {
        const updatedPost = {
          ...post,
          ...formData,
          updatedAt: new Date().toISOString().split("T")[0]
        }
        onPostUpdate(updatedPost)
        addToast({
          title: "Sucesso",
          description: "Post atualizado com sucesso!",
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
      console.error("Erro ao atualizar post:", error)
      addToast({
        title: "Erro",
        description: "Erro ao atualizar post. Tente novamente.",
        color: "danger",
        variant: "solid"
      })
    } finally {
      setLoading(false)
    }
  }

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        imagesUrls: [...prev.imagesUrls, newImageUrl.trim()]
      }))
      setNewImageUrl("")
    }
  }

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagesUrls: prev.imagesUrls.filter((_, i) => i !== index)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Título */}
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título do post"
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(postTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Linguagem de programação */}
          <TechnologySelect
            value={formData.programmingLanguage}
            onValueChange={(value) => setFormData(prev => ({ ...prev, programmingLanguage: value }))}
          />

          {/* Conteúdo */}
          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Digite o conteúdo do post"
              rows={6}
              required
            />
          </div>

          {/* Code snippet */}
          <div>
            <Label htmlFor="codeSnippet">Código (opcional)</Label>
            <Textarea
              id="codeSnippet"
              value={formData.codeSnippet}
              onChange={(e) => setFormData(prev => ({ ...prev, codeSnippet: e.target.value }))}
              placeholder="Cole seu código aqui..."
              rows={8}
            />
          </div>

          {/* Imagens */}
          <div>
            <Label>Imagens</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="URL da imagem"
                />
                <Button type="button" onClick={addImageUrl} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.imagesUrls.length > 0 && (
                <div className="space-y-2">
                  {formData.imagesUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="text-sm truncate flex-1">{url}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImageUrl(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <XCircle className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  )
}
