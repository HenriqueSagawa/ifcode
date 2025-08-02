"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Reply } from "lucide-react"

export function CommentsDashboardContent() {
  const comentarios = [
    {
      id: 1,
      autor: "João Silva",
      email: "joao@exemplo.com",
      comentario: "Excelente artigo! Muito bem explicado e com exemplos práticos.",
      publicacao: "Como criar uma dashboard moderna",
      data: "2024-01-15 14:30",
      status: "pendente",
    },
    {
      id: 2,
      autor: "Maria Santos",
      email: "maria@exemplo.com",
      comentario: "Gostaria de ver mais conteúdo sobre React Hooks.",
      publicacao: "Guia completo de React",
      data: "2024-01-14 09:15",
      status: "aprovado",
    },
    {
      id: 3,
      autor: "Pedro Costa",
      email: "pedro@exemplo.com",
      comentario: "Muito útil! Já estou aplicando essas técnicas no meu projeto.",
      publicacao: "Melhores práticas de UX/UI",
      data: "2024-01-13 16:45",
      status: "aprovado",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">comentários</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">aguardando moderação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">133</div>
            <p className="text-xs text-muted-foreground">comentários aprovados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderação de Comentários</CardTitle>
          <CardDescription>Gerencie os comentários das suas publicações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>{comentario.autor.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{comentario.autor}</p>
                      <p className="text-xs text-muted-foreground">{comentario.email}</p>
                    </div>
                  </div>
                  <Badge variant={comentario.status === "aprovado" ? "default" : "secondary"}>
                    {comentario.status}
                  </Badge>
                </div>

                <p className="text-sm">{comentario.comentario}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Em: {comentario.publicacao}</span>
                  <span>{comentario.data}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Check className="mr-1 h-3 w-3" />
                    Aprovar
                  </Button>
                  <Button size="sm" variant="outline">
                    <X className="mr-1 h-3 w-3" />
                    Rejeitar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Reply className="mr-1 h-3 w-3" />
                    Responder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
