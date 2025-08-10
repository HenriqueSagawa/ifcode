"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, MessageSquare, Heart, Trophy, Plus, Settings, User2, TrendingUp, Star, Award, Target, Calendar, Flame } from "lucide-react"
import { User } from "../../../../../types/next-auth"
import { PostProps } from "@/types/posts"
import { UserRankingStats, RankingEntry } from "../_actions/get-ranking-stats"
import Link from "next/link"
import Image from "next/image"

interface DashboardContentProps {
  user: User
  recentPosts: PostProps[]
  rankingStats: UserRankingStats
  recentActivity: {
    comments: number
    likes: number
    other: number
    streak: number
    totalActivities: number
  }
}

interface RankingLevel {
  name: string
  minPoints: number
  maxPoints: number
  icon: string
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

export function DashboardContent({ user, recentPosts, rankingStats, recentActivity }: DashboardContentProps) {
  function countLikes() {
    let likes = 0;
    recentPosts.forEach(post => likes += post.likes);
    return likes;
  }

  // Função para calcular o nível atual baseado nos pontos
  function getCurrentLevel(points: number): RankingLevel {
    return rankingLevels.find(level => points >= level.minPoints && points <= level.maxPoints) || rankingLevels[0];
  }

  // Função para calcular o próximo nível
  function getNextLevel(currentLevel: RankingLevel): RankingLevel | null {
    const currentIndex = rankingLevels.findIndex(level => level.name === currentLevel.name);
    return currentIndex < rankingLevels.length - 1 ? rankingLevels[currentIndex + 1] : null;
  }

  // Função para calcular o progresso da barra
  function getProgressPercentage(points: number, currentLevel: RankingLevel, nextLevel: RankingLevel | null): number {
    if (!nextLevel) return 100; // Se é o nível máximo
    
    const pointsInCurrentLevel = points - currentLevel.minPoints;
    const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
    
    return Math.min((pointsInCurrentLevel / pointsNeededForNextLevel) * 100, 100);
  }

  // Função para formatar data relativa
  function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "há poucos minutos";
    if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `há ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
  }

  // Função para obter descrição da razão dos pontos
  function getReasonDescription(reason: string): string {
    switch (reason) {
      case 'comment_approved': return 'Comentário aprovado';
      case 'post_liked': return 'Publicação curtida';
      case 'other': return 'Outra atividade';
      default: return 'Atividade';
    }
  }

  // Função para obter ícone da atividade
  function getActivityIcon(reason: string) {
    switch (reason) {
      case 'comment_approved': return MessageSquare;
      case 'post_liked': return Heart;
      case 'other': return Star;
      default: return Trophy;
    }
  }

  // Dados do usuário baseados no Firebase
  const userPoints = rankingStats.totalPoints;
  const currentLevel = getCurrentLevel(userPoints);
  const nextLevel = getNextLevel(currentLevel);
  const progressPercentage = getProgressPercentage(userPoints, currentLevel, nextLevel);
  const pointsToNextLevel = nextLevel ? nextLevel.minPoints - userPoints : 0;

  // Estatísticas baseadas nos dados reais
  const rankingChange = rankingStats.positionChange;
  const weeklyPointsGain = rankingStats.weeklyGain;
  const currentRankPosition = rankingStats.currentPosition;
  const currentStreak = recentActivity.streak;

  const stats = [
    {
      title: "Minhas Publicações",
      value: recentPosts.length,
      description: `+${recentPosts.length} esta semana`,
      icon: FileText,
    },
    {
      title: "Comentários Aprovados",
      value: recentActivity.comments,
      description: `+${recentActivity.comments} comentários aprovados`,
      icon: MessageSquare,
    },
    {
      title: "Curtidas Recebidas",
      value: countLikes(),
      description: `+${countLikes()} esta semana`,
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

  // Transforma as atividades recentes em conquistas
  const achievements = rankingStats.recentEntries.slice(0, 3).map((entry: RankingEntry) => {
    const ActivityIcon = getActivityIcon(entry.reason);
    return {
      title: `${getReasonDescription(entry.reason)} (+${entry.points} pontos)`,
      timeAgo: getRelativeTime(entry.createdAt),
      icon: ActivityIcon,
      color: "bg-green-500/20 text-green-600 dark:text-green-400"
    };
  });

  // Se não há atividades recentes, mostra conquistas padrão
  const defaultAchievements = [
    {
      title: "Bem-vindo ao IFCode",
      timeAgo: "recente",
      icon: Star,
      color: "bg-green-400/20 text-green-500 dark:text-green-300"
    }
  ];

  const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="space-y-8 p-6">
        {/* Header com boas-vindas */}
        <div className="border-b border-gray-200 dark:border-green-500/30 pb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Olá, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Confira seu desempenho na plataforma IFCode
          </p>
          {weeklyPointsGain > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                +{weeklyPointsGain} pontos esta semana!
              </span>
            </div>
          )}
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
                  {recentPosts.length > 0 ? (
                    recentPosts.map((post) => (
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
                                0 comentários
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLanguageColor(post.programmingLanguage)}`}>
                            {post.programmingLanguage}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Nenhuma publicação encontrada</p>
                      <p className="text-sm">Comece criando seu primeiro post!</p>
                    </div>
                  )}
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
            {/* Ranking e Nível do Usuário */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 border-green-200 dark:border-green-500/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300">
                  <div className="p-2 bg-green-500/30 rounded-lg">
                    <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span>Meu Ranking</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nível Atual com Imagem */}
                <div className="text-center space-y-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <Image
                      src={currentLevel.icon}
                      alt={currentLevel.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-300">{currentLevel.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nível {rankingStats.level}</p>
                  </div>
                </div>

                {/* Pontuação */}
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400">{userPoints}</div>
                  <p className="text-green-700 dark:text-green-300 font-medium">pontos conquistados</p>
                  {weeklyPointsGain > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      +{weeklyPointsGain} pontos esta semana
                    </p>
                  )}
                </div>

                {/* Barra de Progresso */}
                {nextLevel && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progresso para {nextLevel.name}</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-3 bg-gray-200 dark:bg-gray-700"
                    />
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      {pointsToNextLevel} pontos para o próximo nível
                    </p>
                  </div>
                )}

                {/* Posição no Ranking */}
                <div className="bg-white/60 dark:bg-black/40 rounded-xl p-4 border border-green-200 dark:border-green-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ranking Geral</span>
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {currentRankPosition > 0 ? `#${currentRankPosition}` : "Não ranqueado"}
                  </div>
                  {currentRankPosition > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {rankingChange > 0 ? `↑ Subiu ${rankingChange} posições` : 
                       rankingChange < 0 ? `↓ Desceu ${Math.abs(rankingChange)} posições` : 
                       '→ Posição mantida'}
                    </p>
                  )}
                </div>

                {/* Stats Secundárias */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 dark:bg-black/40 rounded-xl p-3 border border-green-200 dark:border-green-500/30">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white text-center">{recentActivity.totalActivities}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">Atividades</p>
                  </div>
                  <div className="bg-white/60 dark:bg-black/40 rounded-xl p-3 border border-green-200 dark:border-green-500/30">
                    <div className="flex items-center justify-center mb-2">
                      <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white text-center">{currentStreak}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">Streak</p>
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

            {/* Atividades Recentes */}
            <Card className="bg-white/90 dark:bg-gray-900/70 border-gray-200 dark:border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span>Atividades Recentes</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Suas últimas conquistas e pontuações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayAchievements.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                        <activity.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{activity.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {rankingStats.recentEntries.length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Participe mais para ver suas atividades aqui!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estatísticas Mensais */}
            {rankingStats.monthlyPoints > 0 && (
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-800/40 border-blue-200 dark:border-blue-500/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                    <div className="p-2 bg-blue-500/30 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Estatísticas do Mês</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/40 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pontos do mês</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {rankingStats.monthlyPoints}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/40 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Média diária</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(rankingStats.monthlyPoints / 30)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}