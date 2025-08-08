"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, Heart, Trophy, Plus, Settings, User2, Eye, Star, TrendingUp } from "lucide-react"
import { User } from "../../../../../types/next-auth"
import { PostProps } from "@/types/posts"
import Link from "next/link"

interface DashboardContentProps {
  user: User
  recentPosts: PostProps[]
}

export function DashboardContent({ user, recentPosts }: DashboardContentProps) {
  function countLikes() {
    let likes = 0;
    recentPosts.forEach(post => likes += post.likes);
    return likes;
  }
  
  const stats = [
    {
      title: "Minhas Publicações",
      value: recentPosts.length,
      description: `+ esta semana`,
      icon: FileText,
    },
    {
      title: "Comentários Recebidos",
      value: 0,
      description: `+ novos comentários`,
      icon: MessageSquare,
    },
    {
      title: "Curtidas Totais",
      value: countLikes(),
      description: `+ esta semana`,
      icon: Heart,
    },
  ]

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      "Python": "bg-green-500/20 text-green-600 border-green-500/30 dark:text-green-400 dark:border-green-500/30",
      "JavaScript": "bg-green-400/20 text-green-500 border-green-400/30 dark:text-green-300 dark:border-green-400/30",
      "Node.js": "bg-green-600/20 text-green-700 border-green-600/30 dark:text-green-500 dark:border-green-600/30",
      "SQL": "bg-green-300/20 text-green-600 border-green-300/30 dark:text-green-200 dark:border-green-300/30",
      "Java": "bg-green-500/20 text-green-600 border-green-500/30 dark:text-green-400 dark:border-green-500/30",
      "C++": "bg-green-400/20 text-green-500 border-green-400/30 dark:text-green-300 dark:border-green-400/30"
    }
    return colors[language] || "bg-gray-600/20 text-gray-600 border-gray-600/30 dark:text-gray-400 dark:border-gray-600/30"
  }

  const achievements = [
    {
      title: "100 Curtidas",
      timeAgo: "há 2 dias",
      icon: Heart,
      color: "bg-green-500/20 text-green-600 dark:text-green-400"
    },
    {
      title: "Mentor Ativo",
      timeAgo: "há 1 semana",
      icon: MessageSquare,
      color: "bg-green-600/20 text-green-700 dark:text-green-500"
    },
    {
      title: "Top Contributor",
      timeAgo: "há 2 semanas",
      icon: Trophy,
      color: "bg-green-400/20 text-green-500 dark:text-green-300"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="space-y-8 p-6">
        {/* Header com boas-vindas */}
        <div className="border-b border-gray-200 dark:border-green-500/30 pb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Olá, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Confira seu desempenho na plataforma IFCode</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Coluna Principal - Stats e Posts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
              {stats.map((stat, index) => (
                <Card key={stat.title} className="bg-white/80 dark:bg-gray-900/50 border-gray-200 dark:border-green-500/30 hover:border-gray-300 dark:hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-green-500/10 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
                    <div className="p-2 bg-green-500/20 dark:bg-green-500/20 rounded-lg">
                      <stat.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Meus Posts Recentes */}
            <Card className="bg-white/90 dark:bg-gray-900/70 border-gray-200 dark:border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xl">Meus Posts Recentes</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                  Suas últimas publicações e seu desempenho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="border-l-4 border-green-500 bg-gray-50 dark:bg-gray-800/50 pl-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-800/80 rounded-r-lg transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">{post.title}</h4>
                          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                              <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
                              {post.likes}
                            </span>
                            <span className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                              <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                              nada ainda
                            </span>
                            <span className="text-gray-500 dark:text-gray-500">nada ainda</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLanguageColor(post.programmingLanguage)}`}>
                          {post.programmingLanguage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/publicacoes">
                  <Button
                    variant="outline"
                    className="w-full mt-6 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-500/10 border-green-500/50 hover:border-green-600 dark:hover:border-green-400/70 transition-all duration-300 py-3 text-base font-medium"
                  >
                    Ver todas as publicações
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Direita */}
          <div className="space-y-8">
            {/* Pontuação e Ranking */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 border-green-200 dark:border-green-500/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300">
                  <div className="p-2 bg-green-500/30 rounded-lg">
                    <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span>Minha Pontuação</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-5xl font-bold text-green-600 dark:text-green-400">nada ainda</div>
                  <p className="text-green-700 dark:text-green-300 font-medium">pontos conquistados</p>

                  <div className="bg-white/60 dark:bg-black/40 rounded-xl p-4 border border-green-200 dark:border-green-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ranking Geral</span>
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">nada ainda</div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      ↑ Subiu 0 posições
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-white/60 dark:bg-black/40 rounded-xl p-3 border border-green-200 dark:border-green-500/30">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">nada ainda</div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Badges</p>
                    </div>
                    <div className="bg-white/60 dark:bg-black/40 rounded-xl p-3 border border-green-200 dark:border-green-500/30">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">nada ainda</div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Streak</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card className="bg-white/90 dark:bg-gray-900/70 border-gray-200 dark:border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span>Ações Rápidas</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Crie conteúdo e gerencie seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Link href="/dashboard/publicacoes">
                  <Button className="w-full justify-start bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white transition-all duration-300 py-3 font-medium">
                    <Plus className="mr-3 h-5 w-5" />
                    Nova Publicação
                  </Button>
                </Link>
                <Link href="/dashboard/perfil">
                  <Button className="w-full justify-start bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/70 border-green-200 hover:border-green-300 dark:border-green-500/30 dark:hover:border-green-400/50 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-300 py-3" variant="outline">
                    <User2 className="mr-3 h-5 w-5" />
                    Editar Perfil
                  </Button>
                </Link>
                <Link href="/dashboard/comentarios">
                  <Button className="w-full justify-start bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/70 border-green-200 hover:border-green-300 dark:border-green-500/30 dark:hover:border-green-400/50 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-300 py-3" variant="outline">
                    <MessageSquare className="mr-3 h-5 w-5" />
                    Gerenciar Comentários
                  </Button>
                </Link>
                <Link href="/dashboard/configuracoes">
                  <Button className="w-full justify-start bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/50 dark:hover:bg-gray-700/70 border-green-200 hover:border-green-300 dark:border-green-500/30 dark:hover:border-green-400/50 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-300 py-3" variant="outline">
                    <Settings className="mr-3 h-5 w-5" />
                    Configurações do Perfil
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Conquistas Recentes */}
            <Card className="bg-white/90 dark:bg-gray-900/70 border-gray-200 dark:border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span>Conquistas Recentes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.color}`}>
                        <achievement.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{achievement.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{achievement.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}