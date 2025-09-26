import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPostById } from "../../_actions/get-post"
import { PostDetailContent } from "./post-detail-content"
import type { PostProps } from "@/types/posts"

interface PostDetailWrapperProps {
  postId: string
}

export async function PostDetailWrapper({ postId }: PostDetailWrapperProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const post = await getPostById(postId)

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
            <p className="text-muted-foreground mb-4">
              O post que você está procurando não existe ou foi removido.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Verificar se o post pertence ao usuário
  if (post.userId !== session.user?.id) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso negado</h1>
            <p className="text-muted-foreground mb-4">
              Você não tem permissão para acessar este post.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <PostDetailContent post={post} />
}
