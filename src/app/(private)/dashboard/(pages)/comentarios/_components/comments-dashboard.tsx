"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Reply, MessageSquare, User } from "lucide-react"
import { useState, useTransition } from "react"
import { aprovarComentario, rejeitarComentario, type CommentWithUser, type DashboardStats } from "../_actions/comments-actions"
import { addToast } from "@heroui/toast"

interface CommentsDashboardContentProps {
  comentarios: CommentWithUser[]
  stats: DashboardStats
}

export function CommentsDashboardContent({ comentarios: initialComentarios, stats: initialStats }: CommentsDashboardContentProps) {
  const [comentarios, setComentarios] = useState(initialComentarios)
  const [stats, setStats] = useState(initialStats)
  const [isPending, startTransition] = useTransition()

  const comentariosRecebidos = comentarios.filter(c => c.type === 'received')
  const comentariosFeitos = comentarios.filter(c => c.type === 'made')

  const handleAprovar = async (comentarioId: string) => {
    startTransition(async () => {
      try {
        await aprovarComentario(comentarioId)
        
        // Atualizar estado local
        setComentarios(prev => prev.map(c => 
          c.id === comentarioId ? { ...c, status: "accepted" as const } : c
        ))
        
        // Atualizar stats
        setStats(prev => ({
          ...prev,
          pendentes: prev.pendentes - 1,
          aprovados: prev.aprovados + 1
        }))
        
        addToast({
          title: "Comentário aprovado",
          description: "O comentário foi aprovado com sucesso",
          color: "success"
        })
      } catch (error) {
        addToast({
          title: "Erro ao aprovar comentário",
          description: "Ocorreu um erro ao aprovar o comentário",
          color: 'warning'
        })
      }
    })
  }

  const handleRejeitar = async (comentarioId: string) => {
    startTransition(async () => {
      try {
        await rejeitarComentario(comentarioId)
        
        // Atualizar estado local
        setComentarios(prev => prev.map(c => 
          c.id === comentarioId ? { ...c, status: "rejected" as const } : c
        ))
        
        // Atualizar stats
        setStats(prev => ({
          ...prev,
          pendentes: prev.pendentes - 1,
          rejeitados: prev.rejeitados + 1
        }))
        
        addToast({
          title: "Comentário rejeitado!",
          description: "O comentário foi rejeitado com sucesso",
          color: "danger"
        })
      } catch (error) {
        addToast({
          title: "Erro ao rejeitar comentário",
          description: "Ocorreu um erro ao rejeitar o comentário",
          color: 'warning'
        })
      }
    })
  }

  const formatarData = (data: string) => {
    try {
      return new Date(data).toLocaleString('pt-BR')
    } catch {
      return data
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "accepted":
        return "Aprovado"
      case "rejected":
        return "Rejeitado"
      case "pending":
        return "Pendente"
      default:
        return status
    }
  }

  const getBorderClass = (comentario: CommentWithUser) => {
    // Apenas para comentários recebidos
    if (comentario.type === 'received') {
      switch (comentario.status) {
        case 'accepted':
          return '!border-green-500 '
        case 'rejected':
          return '!border-red-500 '
        case 'pending':
          return '!border-yellow-500'
        default:
          return 'border'
      }
    }
    // Para comentários feitos pelo usuário, borda normal
    return 'border'
  }

  const renderComentario = (comentario: CommentWithUser) => (
    <div key={comentario.id} className={`${getBorderClass(comentario)} border rounded-lg p-4 space-y-3`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comentario.user?.image} />
            <AvatarFallback>
              {comentario.user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{comentario.user?.name}</p>
            <p className="text-xs text-muted-foreground">{comentario.user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={comentario.type === 'received' ? 'outline' : 'secondary'}>
            {comentario.type === 'received' ? 'Recebido' : 'Feito por você'}
          </Badge>
          <Badge variant={getStatusVariant(comentario.status as string)}>
            {getStatusLabel(comentario.status as string)}
          </Badge>
        </div>
      </div>

      <p className="text-sm leading-relaxed">{comentario.content}</p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Em: <span className="font-medium">{comentario.postId}</span></span>
        <span>{formatarData(comentario.createdAt)}</span>
      </div>

      {/* Só mostrar ações de moderação para comentários RECEBIDOS */}
      {comentario.type === 'received' && comentario.status === "pending" && (
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleAprovar(comentario.id)}
            disabled={isPending}
            className="text-green-600 hover:text-green-700"
          >
            <Check className="mr-1 h-3 w-3" />
            Aprovar
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleRejeitar(comentario.id)}
            disabled={isPending}
            className="text-red-600 hover:text-red-700"
          >
            <X className="mr-1 h-3 w-3" />
            Rejeitar
          </Button>
          <Button size="sm" variant="outline" disabled={isPending}>
            <Reply className="mr-1 h-3 w-3" />
            Responder
          </Button>
        </div>
      )}

      {/* Para comentários aprovados/rejeitados ou feitos pelo usuário */}
      {(comentario.type === 'received' && comentario.status !== "pending") || comentario.type === 'made' ? (
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" disabled={isPending}>
            <Reply className="mr-1 h-3 w-3" />
            Responder
          </Button>
        </div>
      ) : null}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">comentários</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recebidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recebidos}</div>
            <p className="text-xs text-muted-foreground">em seus posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Feitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.feitos}</div>
            <p className="text-xs text-muted-foreground">por você</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendentes}</div>
            <p className="text-xs text-muted-foreground">aguardando</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aprovados}</div>
            <p className="text-xs text-muted-foreground">aprovados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejeitados}</div>
            <p className="text-xs text-muted-foreground">rejeitados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para separar comentários recebidos e feitos */}
      <Tabs defaultValue="recebidos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Todos ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="recebidos" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Recebidos ({stats.recebidos})
          </TabsTrigger>
          <TabsTrigger value="feitos" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Feitos ({stats.feitos})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Comentários</CardTitle>
              <CardDescription>Todos os comentários recebidos e feitos por você</CardDescription>
            </CardHeader>
            <CardContent>
              {comentarios.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum comentário encontrado
                </div>
              ) : (
                <div className="space-y-4">
                  {comentarios.map(renderComentario)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recebidos">
          <Card>
            <CardHeader>
              <CardTitle>Comentários Recebidos</CardTitle>
              <CardDescription>Comentários feitos em suas publicações</CardDescription>
            </CardHeader>
            <CardContent>
              {comentariosRecebidos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum comentário recebido encontrado
                </div>
              ) : (
                <div className="space-y-4">
                  {comentariosRecebidos.map(renderComentario)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feitos">
          <Card>
            <CardHeader>
              <CardTitle>Comentários Feitos</CardTitle>
              <CardDescription>Comentários que você fez em outras publicações</CardDescription>
            </CardHeader>
            <CardContent>
              {comentariosFeitos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum comentário feito encontrado
                </div>
              ) : (
                <div className="space-y-4">
                  {comentariosFeitos.map(renderComentario)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}