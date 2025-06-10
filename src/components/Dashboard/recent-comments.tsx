import { useState, useEffect, useMemo } from "react";
import { useComment, CommentData } from "@/hooks/useComment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

interface RecentCommentsProps {
  userId: string;
  userImage?: string;
  userName?: string;
  commentsPerPage?: number;
}

export function RecentComments({ 
  userId, 
  userImage, 
  userName,
  commentsPerPage = 3 
}: RecentCommentsProps) {
  const router = useRouter();
  const { getCommentsByUserId, loading, error, getAllComments } = useComment();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (userId) {
      loadUserComments();
    }
  }, [userId]);

  const loadUserComments = async () => {
    try {
      const userComments = await getCommentsByUserId(userId);
      setComments(userComments);
      console.log(userComments)
    } catch (error) {
      console.error("Erro ao carregar comentários do usuário:", error);
      console.log(error);
    }
  };

  const pagination = useMemo(() => {
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(comments.length / commentsPerPage);
    return { currentComments, totalPages };
  }, [comments, currentPage, commentsPerPage]);

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "Data desconhecida";

    try {
      if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        return date.toLocaleDateString('pt-BR');
      } else if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleDateString('pt-BR');
      }
      return "Formato de data inválido";
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return "Data inválida";
    }
  };

  const handleCommentNavigation = (postId: string) => {
    addToast({
      title: "Navegando para o post",
      description: "Redirecionando para ver o comentário no contexto...",
      color: "warning"
    });
    router.push(`/posts/${postId}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const Pagination = ({ currentPage, totalPages, onPageChange }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void 
  }) => {
    return (
      <div className="flex justify-center items-center mt-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentários Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentários Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">Erro ao carregar comentários: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comentários Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">Nenhum comentário encontrado</p>
              <p className="text-gray-500 mt-2">Comece a interagir com a comunidade comentando em posts!</p>
            </div>
          ) : (
            pagination.currentComments.map((comment) => (
              <div
                key={comment.id}
                onClick={() => handleCommentNavigation(comment.postId)}
                className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              >
                <Avatar>
                  <AvatarImage src={userImage} />
                  <AvatarFallback>
                    {userName?.charAt(0) || comment.authorName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Você comentou em um post
                    </p>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-md line-clamp-3 rounded-md">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {comments.length > 0 && comments.length > commentsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </CardContent>
    </Card>
  );
}