"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PlusCircle, CheckCircle2, AlertCircle, X, Upload, Image as ImageIcon } from "lucide-react"
import { TechnologySelect } from "./technology-select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type React from "react"
import { useState, useRef } from "react"
import { postFormSchema, type PostFormData } from "./post-form-schema"
import { createPost } from "../_actions/create-post"
import { validateImageFiles } from "../_utils/image-validation"
import { z } from "zod"

interface PostFormProps {
  userId: string
}

// Modificamos o schema para remover imagesUrls da validação client-side
const clientFormSchema = postFormSchema.omit({ imagesUrls: true })
type ClientFormData = z.infer<typeof clientFormSchema>

export function PostForm({ userId }: PostFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    title: "",
    content: "",
    type: undefined as any,
    programmingLanguage: "",
    codeSnippet: "",
  })
  
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateFormData = (updates: Partial<ClientFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    
    // Limpar erros dos campos que foram atualizados
    const updatedFields = Object.keys(updates)
    if (updatedFields.some(field => errors[field])) {
      setErrors(prev => {
        const newErrors = { ...prev }
        updatedFields.forEach(field => {
          if (newErrors[field]) {
            delete newErrors[field]
          }
        })
        return newErrors
      })
    }
    
    // Limpar mensagem de sucesso/erro quando o usuário começar a editar
    if (submitMessage) {
      setSubmitMessage(null)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return

    // Validar arquivos
    const validation = validateImageFiles([...imageFiles, ...files])
    
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, images: validation.errors.join(', ') }))
      return
    }

    // Limpar erro de imagens se existir
    if (errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.images
        return newErrors
      })
    }

    // Adicionar novos arquivos
    const newFiles = [...imageFiles, ...files].slice(0, 5) // Máximo 5 imagens
    setImageFiles(newFiles)

    // Criar previews
    const newPreviews = [...imagePreviews]
    
    files.forEach((file, index) => {
      if (newFiles.length <= 5) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setImagePreviews(prev => {
            const updated = [...prev]
            updated[imageFiles.length + index] = result
            return updated.slice(0, 5)
          })
        }
        reader.readAsDataURL(file)
      }
    })

    // Reset do input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    
    // Limpar erro de imagens se não houver mais imagens
    if (imageFiles.length === 1 && errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.images
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    try {
      clientFormSchema.parse(formData)
      
      // Validar imagens separadamente
      if (imageFiles.length > 0) {
        const imageValidation = validateImageFiles(imageFiles)
        if (!imageValidation.valid) {
          setErrors(prev => ({ ...prev, images: imageValidation.errors.join(', ') }))
          return false
        }
      }
      
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: undefined as any,
      programmingLanguage: "",
      codeSnippet: "",
    })
    setImageFiles([])
    setImagePreviews([])
    setErrors({})
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação client-side
    if (!validateForm()) {
      setSubmitMessage({
        type: 'error',
        message: 'Por favor, corrija os erros no formulário antes de continuar.'
      })
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Criar FormData para enviar arquivos
      const formDataToSend = new FormData()
      
      // Adicionar dados do formulário
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('type', formData.type)
      formDataToSend.append('programmingLanguage', formData.programmingLanguage)
      formDataToSend.append('codeSnippet', formData.codeSnippet || '')
      formDataToSend.append('userId', userId)
      
      // Adicionar arquivos de imagem
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`image_${index}`, file)
      })
      formDataToSend.append('imageCount', imageFiles.length.toString())

      const result = await createPost(formDataToSend)

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          message: result.message
        })
        resetForm()
      } else {
        // Se houver erros de validação do servidor
        if (result.errors && Object.keys(result.errors).length > 0) {
          const serverErrors: Record<string, string> = {}
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              serverErrors[field] = messages[0]
            }
          })
          setErrors(serverErrors)
        }
        
        setSubmitMessage({
          type: 'error',
          message: result.message || 'Erro ao criar post. Tente novamente.'
        })
      }
    } catch (error) {
      console.error("Erro inesperado ao enviar formulário:", error)
      setSubmitMessage({
        type: 'error',
        message: 'Erro inesperado. Tente novamente mais tarde.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PlusCircle className="h-5 w-5" />
          <span>Criar Novo Post</span>
        </CardTitle>
        <CardDescription>Compartilhe seu conhecimento com a comunidade</CardDescription>
      </CardHeader>
      <CardContent>
        {submitMessage && (
          <Alert className={`mb-6 ${submitMessage.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <div className="flex items-center">
              {submitMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={`ml-2 ${submitMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {submitMessage.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Digite o título do seu post"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                className={errors.title ? "border-red-500 focus:border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Post *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: ClientFormData["type"]) => updateFormData({ type: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.type ? "border-red-500 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Artigo</SelectItem>
                  <SelectItem value="question">Pergunta</SelectItem>
                  <SelectItem value="project">Projeto</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="discussion">Discussão</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.type}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              placeholder="Escreva o conteúdo do seu post..."
              className={`min-h-[120px] ${errors.content ? "border-red-500 focus:border-red-500" : ""}`}
              value={formData.content}
              onChange={(e) => updateFormData({ content: e.target.value })}
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.content}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {formData.content.length}/5000 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label>Linguagem de Programação *</Label>
            <TechnologySelect 
              value={formData.programmingLanguage} 
              onValueChange={(value) => updateFormData({ programmingLanguage: value })}
            />
            {errors.programmingLanguage && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.programmingLanguage}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="codeSnippet">Código (opcional)</Label>
            <Textarea
              id="codeSnippet"
              placeholder={`Digite seu código em ${formData.programmingLanguage || "sua linguagem escolhida"}...`}
              className="min-h-[120px] font-mono text-sm"
              value={formData.codeSnippet}
              onChange={(e) => updateFormData({ codeSnippet: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Imagens (opcional)</Label>
            
            {/* Input de arquivo oculto */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageSelect}
              disabled={isSubmitting || imageFiles.length >= 5}
              className="hidden"
            />
            
            {/* Botão de upload */}
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting || imageFiles.length >= 5}
              className="w-full border-dashed"
            >
              <Upload className="h-4 w-4 mr-2" />
              {imageFiles.length >= 5 ? 'Máximo de imagens atingido' : 'Selecionar Imagens'}
            </Button>
            
            {/* Preview das imagens */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      disabled={isSubmitting}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {imageFiles[index]?.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {errors.images && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.images}
              </p>
            )}
            
            {imageFiles.length > 0 && (
              <p className="text-xs text-gray-500 flex items-center">
                <ImageIcon className="h-3 w-3 mr-1" />
                {imageFiles.length}/5 imagens selecionadas
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {isSubmitting ? "Publicando..." : "Publicar Post"}
            </Button>
            
            {(Object.keys(errors).length > 0 || formData.title || formData.content || imageFiles.length > 0) && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Limpar
              </Button>
            )}
          </div>
          
          {isSubmitting && imageFiles.length > 0 && (
            <div className="text-sm text-blue-600 flex items-center justify-center">
              <Upload className="h-4 w-4 mr-2 animate-pulse" />
              Enviando {imageFiles.length} imagem(ns) para o Cloudinary...
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}