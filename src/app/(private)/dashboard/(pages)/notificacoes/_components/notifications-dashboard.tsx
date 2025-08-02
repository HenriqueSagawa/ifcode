"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react"

export function NotificationsDashboardContent() {
  const notificacoes = [
    {
      id: 1,
      tipo: "info",
      titulo: "Nova atualização disponível",
      mensagem: "Uma nova versão do sistema está disponível para instalação.",
      data: "2024-01-15 10:30",
      lida: false,
    },
    {
      id: 2,
      tipo: "warning",
      titulo: "Backup pendente",
      mensagem: "O backup automático não foi executado nas últimas 24 horas.",
      data: "2024-01-14 15:20",
      lida: false,
    },
    {
      id: 3,
      tipo: "success",
      titulo: "Publicação aprovada",
      mensagem: "Sua publicação 'Como criar uma dashboard moderna' foi aprovada.",
      data: "2024-01-13 09:15",
      lida: true,
    },
    {
      id: 4,
      tipo: "info",
      titulo: "Novo comentário",
      mensagem: "Você recebeu um novo comentário em sua publicação.",
      data: "2024-01-12 14:45",
      lida: true,
    },
  ]

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getVariant = (tipo: string) => {
    switch (tipo) {
      case "warning":
        return "destructive" as const
      case "success":
        return "default" as const
      default:
        return "secondary" as const
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Notificações</h2>
        </div>
        <Button variant="outline" size="sm">
          Marcar todas como lidas
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">notificações</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avisos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">importantes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">recebidas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Notificações</CardTitle>
          <CardDescription>Acompanhe todas as atividades importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificacoes.map((notificacao) => (
              <div
                key={notificacao.id}
                className={`border rounded-lg p-4 space-y-2 ${!notificacao.lida ? "bg-muted/20" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(notificacao.tipo)}
                    <h4 className="text-sm font-medium">{notificacao.titulo}</h4>
                    {!notificacao.lida && (
                      <Badge variant={getVariant(notificacao.tipo)} className="text-xs">
                        Nova
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{notificacao.data}</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{notificacao.mensagem}</p>
                {!notificacao.lida && (
                  <div className="ml-6">
                    <Button variant="ghost" size="sm">
                      Marcar como lida
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
