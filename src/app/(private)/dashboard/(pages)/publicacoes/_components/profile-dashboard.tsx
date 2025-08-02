"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PostsDashboardContent() {
  const publicacoes = [
    {
      id: 1,
      titulo: "Como criar uma dashboard moderna",
      status: "Publicado",
      data: "2024-01-15",
      visualizacoes: 1234,
    },
    {
      id: 2,
      titulo: "Guia completo de React",
      status: "Rascunho",
      data: "2024-01-14",
      visualizacoes: 0,
    },
    {
      id: 3,
      titulo: "Melhores práticas de UX/UI",
      status: "Publicado",
      data: "2024-01-13",
      visualizacoes: 856,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar publicações..." className="pl-8 w-64" />
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Publicação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas Publicações</CardTitle>
          <CardDescription>Gerencie todas as suas publicações</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Visualizações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publicacoes.map((publicacao) => (
                <TableRow key={publicacao.id}>
                  <TableCell className="font-medium">{publicacao.titulo}</TableCell>
                  <TableCell>
                    <Badge variant={publicacao.status === "Publicado" ? "default" : "secondary"}>
                      {publicacao.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{publicacao.data}</TableCell>
                  <TableCell>{publicacao.visualizacoes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        {publicacao.status === "Publicado" ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
