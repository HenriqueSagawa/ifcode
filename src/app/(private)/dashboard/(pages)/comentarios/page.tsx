import { Suspense } from "react"
import { CommentsDashboardContent } from "./_components/comments-dashboard"
import { getComentariosDoUsuario } from "./_actions/comments-actions"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, User, Eye, Star, Reply } from "lucide-react"
import { BackButton } from "@/components/BackButton"

function CommentsDashboardSkeleton() {
  return (
    <div className="container mx-auto py-6">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton fallbackUrl="/dashboard" />
      </div>
      
      {/* Header */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-9 w-80" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {/* Card Total */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>

        {/* Card Recebidos */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-6" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>

        {/* Card Feitos */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
        </Card>

        {/* Card Pendentes */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-8 w-6" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>

        {/* Card Aprovados */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-4 w-18" />
            </div>
          </CardContent>
        </Card>

        {/* Card Rejeitados */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-8 w-6" />
              <Skeleton className="h-4 w-18" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit mb-6">
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-md">
          <MessageSquare className="h-4 w-4 text-gray-500" />
          <Skeleton className="h-4 w-20" />
          <Badge variant="secondary" className="ml-1">
            <Skeleton className="h-3 w-4" />
          </Badge>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 rounded-md">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <Skeleton className="h-4 w-24" />
          <Badge variant="outline" className="ml-1">
            <Skeleton className="h-3 w-3" />
          </Badge>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 rounded-md">
          <User className="h-4 w-4 text-gray-400" />
          <Skeleton className="h-4 w-20" />
          <Badge variant="outline" className="ml-1">
            <Skeleton className="h-3 w-4" />
          </Badge>
        </div>
      </div>

      {/* Comments Section */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-80" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-0">
          
          {/* Comment Item com borda verde (aprovado) */}
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-20" />
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-orange-400" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
            
            <div className="ml-13 space-y-2">
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="flex items-center space-x-4 ml-13 mt-4">
              <div className="flex items-center space-x-2">
                <Reply className="h-4 w-4 text-gray-400" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-green-500" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-0" />

          {/* Comment Item normal */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-orange-400" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
            
            <div className="ml-13 space-y-2">
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="flex items-center space-x-4 ml-13 mt-4">
              <div className="flex items-center space-x-2">
                <Reply className="h-4 w-4 text-gray-400" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-0" />

          {/* Comment Item normal */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-28" />
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-orange-400" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
            
            <div className="ml-13 space-y-2">
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="flex items-center space-x-4 ml-13 mt-4">
              <div className="flex items-center space-x-2">
                <Reply className="h-4 w-4 text-gray-400" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          {/* Loading more */}
          <div className="text-center py-6">
            <Skeleton className="h-8 w-32 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function CommentsData() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
    return null;
  }

  const userId = session.user.id;

  try {
    const { comentarios, stats } = await getComentariosDoUsuario(userId as string);

    return (
      <CommentsDashboardContent
        currentUserId={userId as string}
        comentarios={comentarios}
        stats={stats}
      />
    );
  } catch (error) {
    console.error("Erro ao carregar comentários:", error);

    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar comentários</h1>
        <p className="text-muted-foreground">
          Ocorreu um erro ao buscar os comentários. Tente novamente mais tarde.
        </p>
      </div>
    );
  }
}

export default function CommentsDashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <BackButton fallbackUrl="/dashboard" />
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Comentários</h1>
        <p className="text-muted-foreground">
          Gerencie todos os comentários recebidos em suas publicações
        </p>
      </div>

      <Suspense fallback={<CommentsDashboardSkeleton />}>
        <CommentsData />
      </Suspense>
    </div>
  )
}