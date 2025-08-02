'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserData } from "@/types/userData"
import { CalendarDays, Github, Mail, Phone, User, Share2, Check } from "lucide-react"
import { formatBirthDate, formatPhoneNumber } from "../_actions/user-utils"
import Link from "next/link"
import { useState } from "react"

interface userProfileProps {
  userData?: UserData
}

export default function UserProfileContent({ userData }: userProfileProps) {
  const [copied, setCopied] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatField = (value: string | undefined | null) => {
    return value || "Não informado"
  }

  const handleShareProfile = async () => {
    const profileUrl = `https://ifcode.com.br/perfil/${userData?.id}`
    
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar URL:', err)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto">
        {/* Banner Section */}
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img
            src={userData?.bannerImage || "/placeholder.svg"}
            alt="Banner do perfil"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Content */}
        <div className="relative px-6 pb-8">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <Avatar className="w-32 h-32 border-4 border-black">
              <AvatarImage src={userData?.image || "/placeholder.svg"} alt={userData?.name} />
              <AvatarFallback className="bg-green-600 text-white text-2xl">{getInitials(userData?.name as string)}</AvatarFallback>
            </Avatar>
          </div>

          {/* Main Info */}
          <div className="pt-20">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold">{userData?.name}</h1>
                </div>
                <Button
                  onClick={handleShareProfile}
                  variant="outline"
                  size="sm"
                  className="bg-green-600/20 border-green-600/30 text-green-400 hover:bg-green-600/30 hover:text-green-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar Perfil
                    </>
                  )}
                </Button>
              </div>
              <p className="text-green-400 text-lg mb-1">{userData?.id}</p>
              <p className="text-gray-400">{userData?.email}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Biografia */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Biografia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{formatField(userData?.bio)}</p>
                </CardContent>
              </Card>

              {/* Informações Pessoais */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Data de Nascimento</p>
                    <p className="text-gray-300">{formatField(formatBirthDate(userData?.birthDate))}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contato */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{userData?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{formatField(formatPhoneNumber(userData?.phone))}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="w-4 h-4 text-gray-400" />
                    <span className="text-blue-400">
                      <Link href={userData?.github || "#"} target="_blank" rel="noopener noreferrer" className="hover:underline"> 
                        {userData?.github ? `${userData?.github}` : "Não informado"}
                      </Link>
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Habilidades */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-green-400">Habilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  {userData?.skills && userData?.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userData.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-300">Não informado</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}