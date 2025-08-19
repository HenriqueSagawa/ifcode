"use client"

import { startTransition, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { addToast } from "@heroui/toast"
import {
  Pencil,
  Camera,
  Mail,
  Calendar,
  Github,
  Phone,
  User,
  Hash,
  Plus,
  Save,
  X,
  Loader2,
  Check,
  Upload,
  Image as ImageIcon,
  Share2,
  Eye
} from "lucide-react"
import { updateUserProfile } from "../_actions/update-user"
import { updateProfileImage, updateBannerImage } from "../_actions/update-user"
import { uploadImage } from "../_actions/upload-image"
import { useRouter } from "next/navigation"

interface UserData {
  id?: string
  name?: string
  email?: string
  image?: string
  bannerImage?: string
  bio?: string
  birthDate?: string
  github?: string
  phone?: string
  skills?: string[]
}

interface ProfilePageProps {
  userData: UserData
}

export function ProfileDashboardContent({ userData = {} }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(userData)
  const [newSkill, setNewSkill] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState<'profile' | 'banner' | null>(null)
  const [copied, setCopied] = useState(false)
  
  const profileImageRef = useRef<HTMLInputElement>(null)
  const bannerImageRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setSaveSuccess(false)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const result = await updateUserProfile({
        id: editData.id,
        name: editData.name as string,
        email: editData.email as string,
        bio: editData.bio,
        birthDate: editData.birthDate,
        github: editData.github,
        phone: editData.phone,
        skills: editData.skills,
      })

      if (result.success) {
        setSaveSuccess(true)
        
        setTimeout(() => {
          setIsEditing(false)
          setSaveSuccess(false)
        }, 1000)
        
        addToast({
          title: "Perfil atualizado com sucesso!",
          description: result.message,
          color: "success",
        })
      }
    } catch (error) {
      addToast({
        title: "Erro",
        description: "Erro inesperado ao atualizar perfil",
        color: "danger",
      })
    } finally {
      setIsLoading(false)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditData(userData)
    setIsEditing(false)
    setNewSkill("")
    setSaveSuccess(false)
  }

  const handleShareProfile = async () => {
    const profileUrl = `https://ifcode.com.br/perfil/${editData.id}`
    
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      addToast({
        title: "Link copiado!",
        description: "O link do seu perfil foi copiado para a área de transferência",
        color: "success",
      })
    } catch (err) {
      console.error('Erro ao copiar URL:', err)
      addToast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        color: "danger",
      })
    }
  }

  const handleViewProfile = () => {
    const profileUrl = `/perfil/${editData.id}`
    router.push(profileUrl)
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setEditData({
        ...editData,
        skills: [...(editData.skills || []), newSkill.trim()]
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setEditData({
      ...editData,
      skills: editData.skills?.filter(skill => skill !== skillToRemove) || []
    })
  }

  const handleImageUpload = (type: 'profile' | 'banner') => {
    if (type === 'profile') {
      profileImageRef.current?.click()
    } else {
      bannerImageRef.current?.click()
    }
  }

  const processImageUpload = async (file: File, type: 'profile' | 'banner') => {
    if (!editData.id) {
      addToast({
        title: "Erro",
        description: "ID do usuário não encontrado",
        color: "danger",
      })
      return
    }

    try {
      setIsUploadingImage(type)
      
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione um arquivo de imagem válido')
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('A imagem deve ter no máximo 5MB')
      }

      // Fazer upload para Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadResult = await uploadImage(formData)
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'Erro no upload da imagem')
      }

      // Atualizar no Firebase
      let updateResult
      if (type === 'profile') {
        updateResult = await updateProfileImage(userData.id || editData.id, uploadResult.url)
      } else {
        updateResult = await updateBannerImage(userData.id || editData.id, uploadResult.url)
      }

      if (updateResult.success) {
        setEditData(prev => ({
          ...prev,
          [type === 'profile' ? 'image' : 'bannerImage']: uploadResult.url
        }))

        addToast({
          title: "Sucesso!",
          description: updateResult.message,
          color: "success",
        })
      } else {
        throw new Error(updateResult.message)
      }

    } catch (error) {
      console.error('Erro no upload:', error)
      addToast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        color: "danger",
      })
    } finally {
      setIsUploadingImage(null)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
    const file = event.target.files?.[0]
    if (file) {
      processImageUpload(file, type)
    }
  }

  return (
    <div className="min-h-screen p-4 bg-transparent transition-colors duration-300">
      {/* Overlay para indicar salvamento */}
      {(isLoading || isUploadingImage) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-gray-900 dark:text-white font-medium">
              {isUploadingImage 
                ? `Fazendo upload da ${isUploadingImage === 'profile' ? 'foto de perfil' : 'imagem de banner'}...`
                : 'Salvando perfil...'
              }
            </span>
          </div>
        </div>
      )}

      {/* Inputs de arquivo ocultos */}
      <input
        ref={profileImageRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, 'profile')}
        className="hidden"
      />
      <input
        ref={bannerImageRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, 'banner')}
        className="hidden"
      />

      <div className="">
        {/* Grid Layout: Esquerda (perfil principal) e Direita (informações + habilidades) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

          {/* Coluna Esquerda - Perfil Principal */}
          <div className="lg:col-span-2">
            <Card className={`overflow-hidden border-0 shadow-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-fit transition-all duration-300 ${
              saveSuccess ? 'ring-2 ring-green-500 shadow-green-500/20' : ''
            }`}>
              <div className="relative">
                {/* Banner */}
                <div
                  className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative group cursor-pointer"
                  style={{
                    backgroundImage: editData.bannerImage ? `url(${editData.bannerImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  onClick={() => handleImageUpload('banner')}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                      {isUploadingImage === 'banner' ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <div className="flex flex-col items-center space-y-1">
                          <ImageIcon className="h-5 w-5 text-white" />
                          <span className="text-xs text-white font-medium">
                            {editData.bannerImage ? 'Alterar banner' : 'Adicionar banner'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-16 left-8">
                  <div className="relative group cursor-pointer" onClick={() => handleImageUpload('profile')}>
                    <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-700 shadow-xl">
                      <AvatarImage src={editData.image} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {editData.name
                          ? editData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                          : <User className="h-12 w-12" />
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {isUploadingImage === 'profile' ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <div className="flex flex-col items-center space-y-1">
                          <Camera className="h-6 w-6 text-white" />
                          <span className="text-xs text-white font-medium">
                            {editData.image ? 'Alterar' : 'Adicionar'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="pt-20 pb-8">
                <div className="space-y-6">
                  {/* Nome e Action Buttons */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between sm:flex-row flex-col sm:space-x-4">
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nome Completo</Label>
                            <Input
                              id="name"
                              value={editData.name || ""}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              placeholder="Digite seu nome completo"
                              disabled={isLoading || isUploadingImage !== null}
                              className="text-xl font-semibold bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 transition-all"
                            />
                          </div>
                        ) : (
                          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {editData.name || (
                              <span className="text-gray-500 dark:text-gray-400 text-xl font-normal">
                                <Plus className="h-5 w-5 inline mr-2" />
                                Adicionar nome
                              </span>
                            )}
                          </h1>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="ml-4">
                        {isEditing ? (
                          <div className="space-x-2 flex">
                            <Button 
                              onClick={handleSave} 
                              size="sm" 
                              disabled={isLoading || saveSuccess || isUploadingImage !== null}
                              className={`transition-all duration-300 ${
                                saveSuccess 
                                  ? 'bg-green-600 hover:bg-green-600' 
                                  : 'bg-green-600 hover:bg-green-700'
                              } ${isLoading || isUploadingImage ? 'cursor-not-allowed opacity-75' : ''}`}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Salvando...
                                </>
                              ) : saveSuccess ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Salvo!
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Salvar
                                </>
                              )}
                            </Button>
                            <Button 
                              onClick={handleCancel} 
                              variant="outline" 
                              size="sm" 
                              disabled={isLoading || isUploadingImage !== null}
                              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                            <Button 
                              onClick={handleViewProfile}
                              variant="outline" 
                              size="sm" 
                              disabled={!editData.id || isUploadingImage !== null}
                              className="border-blue-300 dark:border-blue-600/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-600/20 hover:text-blue-700 dark:hover:text-blue-300 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </Button>
                            
                            <Button 
                              onClick={handleShareProfile}
                              variant="outline" 
                              size="sm" 
                              disabled={!editData.id || isUploadingImage !== null}
                              className="border-green-300 dark:border-green-600/30 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-600/20 hover:text-green-700 dark:hover:text-green-300 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                            >
                              {copied ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Copiado!
                                </>
                              ) : (
                                <>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Compartilhar
                                </>
                              )}
                            </Button>

                            <Button 
                              onClick={() => setIsEditing(true)} 
                              variant="secondary" 
                              size="sm" 
                              disabled={isUploadingImage !== null}
                              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4 mr-2" />
                      {isEditing ? (
                        <Input
                          value={editData.email || ""}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          placeholder="Digite seu email"
                          type="email"
                          disabled={isLoading || isUploadingImage !== null}
                          className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 transition-all"
                        />
                      ) : (
                        <span>
                          {editData.email || (
                            <span className="text-gray-500 dark:text-gray-400">
                              <Plus className="h-4 w-4 inline mr-1" />
                              Adicionar email
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    {editData.id && (
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <Hash className="h-4 w-4 mr-2" />
                        ID: {editData.id}
                      </div>
                    )}
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-700" />

                  {/* Biografia */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Biografia</h3>
                    {isEditing ? (
                      <Textarea
                        value={editData.bio || ""}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        placeholder="Conte um pouco sobre você..."
                        disabled={isLoading || isUploadingImage !== null}
                        className="min-h-[150px] bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 transition-all"
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed min-h-[100px]">
                        {editData.bio || (
                          <span className="text-gray-500 dark:text-gray-400 italic">
                            <Plus className="h-4 w-4 inline mr-2" />
                            Adicionar biografia
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Informações Pessoais e Habilidades */}
          <div className="space-y-6">

            {/* Informações Pessoais */}
            <Card className={`border-0 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 ${
              saveSuccess ? 'ring-2 ring-green-500 shadow-green-500/20' : ''
            }`}>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Informações Pessoais</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Detalhes do seu perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">

                  {/* Data de Nascimento */}
                  <div className="space-y-2">
                    <Label className="flex items-center text-gray-700 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      Data de Nascimento
                    </Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.birthDate || ""}
                        onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                        disabled={isLoading || isUploadingImage !== null}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        {editData.birthDate ? (
                          <span className="text-gray-900 dark:text-white">
                            {new Date(editData.birthDate).toLocaleDateString('pt-BR')}
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            <Plus className="h-4 w-4 inline mr-2" />
                            Adicionar data de nascimento
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <Label className="flex items-center text-gray-700 dark:text-gray-300">
                      <Phone className="h-4 w-4 mr-2" />
                      Telefone
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.phone || ""}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        disabled={isLoading || isUploadingImage !== null}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <span className="text-gray-900 dark:text-white">
                          {editData.phone || (
                            <span className="text-gray-500 dark:text-gray-400">
                              <Plus className="h-4 w-4 inline mr-2" />
                              Adicionar telefone
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* GitHub */}
                  <div className="space-y-2">
                    <Label className="flex items-center text-gray-700 dark:text-gray-300">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.github || ""}
                        onChange={(e) => setEditData({ ...editData, github: e.target.value })}
                        placeholder="https://github.com/seuusuario"
                        disabled={isLoading || isUploadingImage !== null}
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        {editData.github ? (
                          <a href={editData.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                            {editData.github}
                          </a>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            <Plus className="h-4 w-4 inline mr-2" />
                            Adicionar GitHub
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Habilidades */}
            <Card className={`border-0 shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 ${
              saveSuccess ? 'ring-2 ring-green-500 shadow-green-500/20' : ''
            }`}>
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Habilidades</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Suas principais competências</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Digite uma habilidade"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      disabled={isLoading || isUploadingImage !== null}
                      className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50 transition-all"
                    />
                    <Button 
                      onClick={addSkill} 
                      size="sm" 
                      disabled={isLoading || isUploadingImage !== null}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {editData.skills && editData.skills.length > 0 ? (
                    editData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors border border-blue-200 dark:border-blue-700"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            disabled={isLoading || isUploadingImage !== null}
                            className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 disabled:opacity-50"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 italic p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-full text-center">
                      <Plus className="h-6 w-6 inline mr-2" />
                      {isEditing ? "Use o campo acima para adicionar suas habilidades" : "Nenhuma habilidade adicionada ainda"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}