'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User as UserData } from "@/../types/next-auth"
import { CalendarDays, Github, Mail, Phone, User, Share2, Check, Trophy } from "lucide-react"
import { formatBirthDate, formatPhoneNumber } from "../_actions/user-utils"
import { getUserRankingPosition } from "../_actions/get-user"
import Link from "next/link"
import { useState, useEffect } from "react"

// Tipos para o ranking
interface RankingLevel {
  name: string
  minPoints: number
  maxPoints: number
  icon: string
}

interface RankingPosition {
  position: number
}

interface userProfileProps {
  userData?: UserData
}

const rankingLevels: RankingLevel[] = [
  { name: "Aprendiz", minPoints: 0, maxPoints: 99, icon: "/img/aprendiz-icon.png" },
  { name: "Estudante", minPoints: 100, maxPoints: 249, icon: "/img/estudante-icon.png" },
  { name: "Programador Júnior", minPoints: 250, maxPoints: 499, icon: "/img/programador-junior-icon.png" },
  { name: "Programador Pleno", minPoints: 500, maxPoints: 999, icon: "/img/programador-pleno-icon.png" },
  { name: "Programador Sênior", minPoints: 1000, maxPoints: 1999, icon: "/img/programador-senior-icon.png" },
  { name: "Arquiteto de Software", minPoints: 2000, maxPoints: 3999, icon: "/img/arquiteto-software-icon.png" },
  { name: "Mestre dos Códigos", minPoints: 4000, maxPoints: Infinity, icon: "/img/mestre-dos-codigos-icon.png" }
]

export default function UserProfileContent({ userData }: userProfileProps) {
  const [copied, setCopied] = useState(false)
  const [rankingPosition, setRankingPosition] = useState<RankingPosition>({ position: 0 })

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

  const getCurrentLevel = (points: number): RankingLevel => {
    return rankingLevels.find(level => points >= level.minPoints && points <= level.maxPoints) || rankingLevels[0]
  }

  const getNextLevel = (currentLevel: RankingLevel): RankingLevel | null => {
    const currentIndex = rankingLevels.indexOf(currentLevel)
    return currentIndex < rankingLevels.length - 1 ? rankingLevels[currentIndex + 1] : null
  }

  const getProgressToNextLevel = (points: number, currentLevel: RankingLevel): number => {
    const nextLevel = getNextLevel(currentLevel)
    if (!nextLevel) return 100 // Já está no nível máximo
    
    const pointsInCurrentLevel = points - currentLevel.minPoints
    const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints
    return Math.min(100, (pointsInCurrentLevel / pointsNeededForNextLevel) * 100)
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

  // Busca a posição no ranking
  useEffect(() => {
    const fetchRankingPosition = async () => {
      if (userData?.id && userData?.totalPoints !== undefined) {
        try {
          const result = await getUserRankingPosition(userData.id, userData.totalPoints)
          setRankingPosition({ position: result.position })
        } catch (error) {
          console.error('Erro ao buscar posição no ranking:', error)
          // Valores padrão em caso de erro
          setRankingPosition({ position: 0 })
        }
      }
    }

    fetchRankingPosition()
  }, [userData])

  const currentLevel = userData?.totalPoints !== undefined ? getCurrentLevel(userData.totalPoints) : rankingLevels[0]
  const nextLevel = getNextLevel(currentLevel)
  const progressPercentage = userData?.totalPoints !== undefined ? getProgressToNextLevel(userData.totalPoints, currentLevel) : 0

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
              {/* Ranking e Nível */}
              <Card className="bg-gray-900 border-gray-800 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Ranking & Nível
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Nível Atual */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center object-contain">
                          <img
                            src={currentLevel.icon}
                            alt={currentLevel.name}
                            className="w-12 h-12"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <Trophy className="w-8 h-8 text-green-400" style={{display: 'none'}} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-green-400">{currentLevel.name}</h3>
                          <p className="text-gray-400">{userData?.totalPoints || 0} pontos</p>
                        </div>
                      </div>
                      
                      {/* Progresso para próximo nível */}
                      {nextLevel && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progresso para {nextLevel.name}</span>
                            <span className="text-green-400">{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            {nextLevel.minPoints - (userData?.totalPoints || 0)} pontos para o próximo nível
                          </p>
                        </div>
                      )}
                      
                      {!nextLevel && (
                        <div className="p-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                          <p className="text-yellow-400 text-sm font-medium">🏆 Nível máximo alcançado!</p>
                        </div>
                      )}
                    </div>

                    {/* Posição no Ranking */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-1">
                          #{rankingPosition.position}
                        </div>
                        <p className="text-gray-400 mb-2">Posição no ranking geral</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="text-lg font-semibold text-white">{userData?.totalPoints || 0}</div>
                          <div className="text-xs text-gray-400">Total de Pontos</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="text-lg font-semibold text-green-400">{userData?.level || 1}</div>
                          <div className="text-xs text-gray-400">Nível</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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