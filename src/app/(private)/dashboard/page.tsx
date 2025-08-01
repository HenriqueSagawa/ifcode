"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from 'next/dynamic'; // 1. Importar o 'dynamic'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { usePosts } from "@/hooks/usePosts";

import { UserData } from "@/types/userData";
import { PostsProps } from "@/types/posts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addToast } from "@heroui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareIcon, PencilIcon, GithubIcon, PhoneIcon, ChevronLeft, ChevronRight, Calendar, PenSquare, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@heroui/spinner";

// 2. Definir os componentes dinâmicos
// Eles serão carregados apenas quando forem necessários.
// Adicionamos um estado de 'loading' para melhorar a experiência do usuário.

const CreatePost = dynamic(() =>
    import('@/components/CreatePost').then(mod => mod.CreatePost),
    {
        loading: () => <div className="h-48 flex justify-center items-center"><Spinner /></div>,
        ssr: false // Geralmente componentes de criação/edição são apenas no cliente
    }
);

const EditProfile = dynamic(() =>
    import('@/components/EditProfile').then(mod => mod.EditProfile),
    {
        // O loading não é tão crítico aqui, pois o botão já está visível
        ssr: false
    }
);

const NotificationDropdown = dynamic(() =>
    import('@/components/Notification').then(mod => mod.NotificationDropdown),
    {
        loading: () => <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />,
        ssr: false
    }
);

const RecentComments = dynamic(() =>
    import('@/components/Dashboard/recent-comments').then(mod => mod.RecentComments),
    {
        loading: () => (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Comentários Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Spinner label="Carregando comentários..." />
                    </div>
                </CardContent>
            </Card>
        ),
        ssr: false // Este componente busca dados no cliente, então desativar SSR é uma boa prática.
    }
);


type Comment = {
    id: string;
    postId: string;
    postTitle: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    date: string;
};

const SKILL_COLORS = ["bg-red-200", "bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-purple-200", "bg-pink-200"];
const POSTS_PER_PAGE = 3;
const COMMENTS_PER_PAGE = 3;

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostsProps[]>([]);
    const [postsCurrentPage, setPostsCurrentPage] = useState(1);
    const [recentCommentsCurrentPage, setRecentCommentsCurrentPage] = useState(1);
    const dataFetched = useRef(false);

    const { getUserByEmail } = useUser();
    const { getPosts } = usePosts();

    const stats = useMemo(() => [
        {
            title: "Total de Posts",
            value: posts.length,
            icon: <PenSquare className="h-5 w-5 text-primary" />,
            trend: { value: 12.4, positive: true }
        },
        {
            title: "Comentários",
            value: posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0),
            icon: <MessageSquare className="h-5 w-5 text-primary" />,
            trend: { value: 8.2, positive: true }
        },
        {
            title: "Curtidas Recebidas",
            value: posts.reduce((acc, post) => acc + (Array.isArray(post.likes) ? post.likes.length : 0), 0),
            icon: <ThumbsUp className="h-5 w-5 text-primary" />,
            trend: { value: 24.1, positive: true }
        }
    ], [posts]);

    const postsPagination = useMemo(() => {
        const indexOfLastPost = postsCurrentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
        const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
        return { currentPosts, totalPages };
    }, [posts, postsCurrentPage]);

    const pagination = useMemo(() => {
        const indexOfLastComment = recentCommentsCurrentPage * COMMENTS_PER_PAGE;
        const indexOfFirstComment = indexOfLastComment - COMMENTS_PER_PAGE;
        const currentComments = posts.slice(indexOfFirstComment, indexOfLastComment);
        const totalPages = Math.ceil(posts.length / COMMENTS_PER_PAGE);
        return { currentComments, totalPages };
    }, [posts, recentCommentsCurrentPage]);

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (dataFetched.current) {
            return;
        }

        async function fetchData() {
            if (!session?.user?.email) return;

            try {
                setLoading(true);

                const userFetch = await getUserByEmail(session.user.email);

                setUser(userFetch);

                if (userFetch?.id) {

                    try {

                        const postsData = await getPosts();

                        const filteredPosts = postsData.filter(post => post.id === userFetch?.id);
                        setPosts(filteredPosts);


                    } catch (postsError) {
                        console.error("Erro ao buscar posts:", postsError);
                    }
                }




            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                dataFetched.current = true;
            }
        }

        fetchData();
    }, [session, status, router]);

    const formatDate = useMemo(() => (timestamp: any): string => {
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
    }, []);

    const handleShareProfile = () => {
        if (!user?.id) return;
        navigator.clipboard.writeText(`https://ifcode.com.br/perfil/${user.id}`);
        addToast({
            title: "Url do Perfil",
            description: "Url do perfil copiado com sucesso!",
            color: "success"
        });
    };

    const handlePostNavigation = (postId: string) => {
        addToast({
            title: "Navegando para o post",
            description: "Redirecionando para o conteúdo completo...",
            color: "warning"
        });
        router.push(`/posts/${postId}`);
    };

    const handlePageChange = (pageNumber: number) => {
        setPostsCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner color="success" label="Seja paciente! Não quebre o monitor" size="lg" />
            </div>
        );
    }

    const UserInfo = () => (
        <div className="flex flex-wrap gap-4 mt-4">
            {user?.github ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GithubIcon className="h-4 w-4" />
                    {user.github}
                </div>
            ) : (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GithubIcon className="h-4 w-4" />
                    Não disponível
                </div>
            )}
            {user?.phone ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4" />
                    {user.phone}
                </div>
            ) : (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4" />
                    Não disponível
                </div>
            )}
        </div>
    );

    const UserSkills = () => (
        user?.skills && user.skills.length > 0 && (
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Habilidades</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {user.skills.map((skill: string, index: number) => (
                        <span key={index} className={`text-zinc-800 px-3 py-1 ${SKILL_COLORS[index % SKILL_COLORS.length]} text-sm rounded-full`}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        )
    );

    const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => {
        return (
            <div className="flex justify-center items-center mt-6 gap-2">
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

    return (
        <div className="container mx-auto py-6 px-4 lg:px-8">
            <div className="flex justify-end mb-6">
                <NotificationDropdown userId={user?.id || ""} />
            </div>

            <div className="grid gap-6">
                <Card className="overflow-hidden bg-white shadow-md">
                    <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${user?.bannerImage || '/default-banner.webp'})` }}></div>

                    <CardContent className="p-6 relative">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg -mt-16">
                                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                                    <AvatarFallback>{user?.name}</AvatarFallback>
                                </Avatar>
                                <div className="mt-4 text-center md:text-left">
                                    <p className="text-xs text-gray-500">ID: {user?.id}</p>
                                    <p className="text-xs text-gray-500">Membro desde: {formatDate(user?.createdAt)}</p>
                                </div>
                            </div>

                            <div className="flex-grow space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold">{user?.name} {user?.lastName}</h2>
                                    <p className="text-gray-600">{user?.email}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700">{user?.bio || "Não disponível"}</p>
                                    <UserInfo />
                                </div>

                                <UserSkills />
                            </div>

                            <div className="flex gap-2 mt-4 md:mt-0 md:self-start">
                                <Button variant="outline" size="sm" onClick={handleShareProfile} className="flex items-center gap-1">
                                    <ShareIcon className="h-4 w-4" />
                                    Compartilhar
                                </Button>
                                {user?.fullData ? (
                                    <EditProfile user={user} />
                                ) : (
                                    <Link href="/complete-profile">
                                        <Button variant="default" size="sm" className="flex items-center gap-1">
                                            <PencilIcon className="h-4 w-4" />
                                            Finalizar cadastro
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <CreatePost
                    author={user?.name || ""}
                    userImage={user?.profileImage || ""}
                    id={user?.id || ""}
                    email={user?.email || ""}
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <PenSquare className="h-5 w-5" />
                            Posts Recentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {posts.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-muted-foreground text-lg font-medium">Nenhum post encontrado</p>
                                    <p className="text-gray-500 mt-2">Comece a compartilhar seu conhecimento criando um novo post!</p>
                                </div>
                            ) : (
                                postsPagination.currentPosts.map((post) => (
                                    <div
                                        key={post.postId}
                                        onClick={() => post?.postId && handlePostNavigation(post.postId)}
                                        className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                                    >
                                        <Avatar>
                                            <AvatarImage src={user?.profileImage} />
                                            <AvatarFallback>{user?.name?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-semibold">{post.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(post.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3" />
                                                    {post.comments?.length || 0} comentários
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <ThumbsUp className="h-3 w-3" />
                                                    {typeof post.likes === 'number'
                                                        ? post.likes
                                                        : Array.isArray(post.likes)
                                                            //@ts-ignore
                                                            ? post.likes.length || 0
                                                            : 0} curtidas
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {posts.length > 0 && (
                            <div className="mt-4 flex flex-col items-center">
                                {posts.length > POSTS_PER_PAGE && (
                                    <Pagination
                                        currentPage={postsCurrentPage}
                                        totalPages={postsPagination.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}

                                <div className="mt-4">
                                    <Link href="/posts">
                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                            <ChevronRight className="h-4 w-4" />
                                            Ver todos os posts
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {user?.id && (
                    <RecentComments
                        userId={user.id}
                        userImage={user.profileImage}
                        userName={`${user.name} ${user.lastName || ''}`.trim()}
                        commentsPerPage={3}
                    />
                )}
            </div>
        </div>
    );
}