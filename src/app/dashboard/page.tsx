"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "@/services/firebaseConnection";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { UserData } from "@/types/userData";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addToast } from "@heroui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareIcon, PencilIcon, GithubIcon, PhoneIcon, ChevronLeft, ChevronRight, Calendar, ImageIcon, Code, Send, PenSquare, MessageSquare, ThumbsUp } from "lucide-react";
import { CreatePost } from "@/components/CreatePost";
import Link from "next/link";
import { EditProfile } from "@/components/EditProfile";
import { Spinner } from "@heroui/spinner";
import { NotificationDropdown } from "@/components/Notification";

import { PostsProps } from "@/types/posts";

// Types
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

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<any>();
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [postType, setPostType] = useState("article");
    const [recentCommentsCurrentPage, setRecentCommentsCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<PostsProps[]>([]);

    const stats = [
        {
            title: "Total de Posts",
            value: 147,
            icon: <PenSquare className="h-5 w-5 text-primary" />,
            trend: { value: 12.4, positive: true }
        },
        {
            title: "Comentários",
            value: 842,
            icon: <MessageSquare className="h-5 w-5 text-primary" />,
            trend: { value: 8.2, positive: true }
        },
        {
            title: "Curtidas Recebidas",
            value: 3254,
            icon: <ThumbsUp className="h-5 w-5 text-primary" />,
            trend: { value: 24.1, positive: true }
        }
    ];

    const allComments: Comment[] = [

    ];

    const commentsPerPage = 3;
    const indexOfLastComment = recentCommentsCurrentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = allComments.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(allComments.length / commentsPerPage);

    const dataFetched = useRef(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (dataFetched.current) {
            console.log("Dados já carregados, saindo do useEffect.");
            return;
        }

        async function fetchData() {
            try {
                setLoading(true);
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", session?.user?.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const userData = doc.data() as UserData;
                    const { id, ...rest } = userData;
                    setUser({ id: doc.id, ...rest });
                    dataFetched.current = true;


                    const postsRef = collection(db, "posts");
                    const postsQuery = query(
                        postsRef,
                        orderBy("createdAt", "desc"),
                    );
                    const postsSnapshot = await getDocs(postsQuery);
                    const postsData = postsSnapshot.docs.map(doc => ({
                        postId: doc.id,
                        ...doc.data()
                    })) as PostsProps[];


                    const filteredPosts = postsData.filter(post => post.id === doc.id);
                    setPosts(filteredPosts);
                } else {
                    return null;
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                return null;
            } finally {
                setLoading(false);
            }
        }

        fetchData();

    }, [session, status, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner color="success" label="Seja paciente! Não quebre o monitor" size="lg" />
            </div>
        )
    }

    const formatDate = (timestamp: any): string => {
        if (!timestamp) return "Data desconhecida";

        try {

            if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {

                const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }

            else if (typeof timestamp === 'string') {
                const date = new Date(timestamp);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
            return "Formato de data inválido";
        } catch (error) {
            console.error("Erro ao formatar a data:", error);
            return "Data inválida";
        }
    };


    const handleShareProfile = () => {
        navigator.clipboard.writeText(`https://ifcode.com.br/perfil/${user?.id}`);
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

    const skillColors = ["bg-red-200", "bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-purple-200", "bg-pink-200"];

    return (
        <div className="container mx-auto py-6 px-4 lg:px-8">
            {/* Header com notificações */}
            <div className="flex justify-end mb-6">
                <NotificationDropdown userId={user?.id} />
            </div>

            <div className="grid gap-6">
                {/* User Header */}
                <Card className="overflow-hidden bg-white shadow-md">
                    {/* Banner do usuário */}
                    <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${user?.bannerImage || '/default-banner.jpg'})` }}></div>

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
                                    <p className="text-sm text-gray-700">{user?.bio ? user?.bio : "Não disponível"}</p>
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {user?.github ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <GithubIcon className="h-4 w-4" />
                                                {user?.github}
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
                                                {user?.phone}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <PhoneIcon className="h-4 w-4" />
                                                Não disponível
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Habilidades */}
                                {user?.skills && user.skills.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold">Habilidades</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {user.skills.map((skill: string, index: number) => (
                                                <span key={index} className={`text-zinc-800 px-3 py-1 ${skillColors[index % skillColors.length]} text-sm rounded-full`}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
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

                {/* Create Post */}
                <CreatePost author={user?.name} userImage={user?.profileImage} id={user?.id} email={user?.email} />


                {/* Posts Recentes */}
                <div className="mt-8">
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
                                    posts.map((post) => (
                                        <div
                                            key={post.id}
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
                                                        comentários
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ThumbsUp className="h-3 w-3" />
                                                         curtidas
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {posts.length > 0 && (
                                <div className="mt-4 flex justify-center">
                                    <Link href="/posts">
                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                            <ChevronRight className="h-4 w-4" />
                                            Ver todos os posts
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}