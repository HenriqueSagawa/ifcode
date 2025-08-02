"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Eye, MessageSquare, Plus, Settings } from "lucide-react"

export function DashboardContent() {
  const stats = [
    {
      title: "Total de Usuários",
      value: "1,234",
      description: "+12% em relação ao mês passado",
      icon: Users,
    },
    {
      title: "Publicações",
      value: "89",
      description: "5 publicadas esta semana",
      icon: FileText,
    },
    {
      title: "Visitantes",
      value: "12,543",
      description: "+8% em relação ao mês passado",
      icon: Eye,
    },
    {
      title: "Comentários",
      value: "456",
      description: "23 aguardando moderação",
      icon: MessageSquare,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atalhos Rápidos</CardTitle>
            <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Nova Publicação
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configurações do Site
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Moderar Comentários
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Nova publicação criada</p>
                  <p className="text-xs text-muted-foreground">há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Comentário aprovado</p>
                  <p className="text-xs text-muted-foreground">há 4 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Configurações atualizadas</p>
                  <p className="text-xs text-muted-foreground">há 1 dia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
