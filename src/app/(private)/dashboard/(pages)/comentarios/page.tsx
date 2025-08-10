import { CommentsDashboardContent } from "./_components/comments-dashboard";
import { getComentariosDoUsuario } from "./_actions/comments-actions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CommentsDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userId = session.user.id

    try {
        const { comentarios, stats } = await getComentariosDoUsuario(userId as string);

        return (
            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard de Comentários</h1>
                    <p className="text-muted-foreground">
                        Gerencie todos os comentários recebidos em suas publicações
                    </p>
                </div>

                <CommentsDashboardContent
                    currentUserId={userId as string}
                    comentarios={comentarios}
                    stats={stats}
                />
            </div>
        );
    } catch (error) {
        console.error("Erro ao carregar comentários:", error);

        return (
            <div className="container mx-auto py-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar comentários</h1>
                    <p className="text-muted-foreground">
                        Ocorreu um erro ao buscar os comentários. Tente novamente mais tarde.
                    </p>
                </div>
            </div>
        );
    }
}