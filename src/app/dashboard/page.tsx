"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "@/services/firebaseConnection";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserData } from "@/types/userData";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShareIcon, PencilIcon, GithubIcon, PhoneIcon, ChevronLeft, ChevronRight, Calendar, ImageIcon, Code, Send, PenSquare, MessageSquare, ThumbsUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { link } from "fs";

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
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<any>(null); // Inicializar com null ou um valor padrão
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [postType, setPostType] = useState("article");
    const [recentCommentsCurrentPage, setRecentCommentsCurrentPage] = useState(1);

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
        {
            id: "comment1",
            postId: "post1",
            postTitle: "Introdução ao Next.js 14",
            author: {
                name: "Maria Oliveira",
                avatar: "/avatar-maria.png"
            },
            content: "Excelente artigo! Consegui entender perfeitamente as novas funcionalidades do Next.js 14.",
            date: "24 Fev 2025"
        },
        {
            id: "comment2",
            postId: "post2",
            postTitle: "Como configurar um projeto com TypeScript",
            author: {
                name: "Pedro Santos",
                avatar: "/avatar-pedro.png"
            },
            content: "Você poderia explicar melhor a parte de configuração do tsconfig.json?",
            date: "20 Fev 2025"
        },
        {
            id: "comment3",
            postId: "post3",
            postTitle: "Tailwind CSS vs. CSS Modules",
            author: {
                name: "Ana Lima",
                avatar: "/avatar-ana.png"
            },
            content: "Concordo com sua análise. Tenho usado o Tailwind há alguns meses e a produtividade aumentou bastante.",
            date: "15 Fev 2025"
        },
        {
            id: "comment4",
            postId: "post4",
            postTitle: "Criando uma API REST com Next.js",
            author: {
                name: "Carlos Mendes",
                avatar: "/avatar-carlos.png"
            },
            content: "Consegui implementar a API seguindo seu tutorial. Muito obrigado pela ajuda!",
            date: "12 Fev 2025"
        },
        {
            id: "comment5",
            postId: "post5",
            postTitle: "Como otimizar o desempenho do seu site Next.js",
            author: {
                name: "Juliana Costa",
                avatar: "/avatar-juliana.png"
            },
            content: "As dicas de otimização de imagens foram muito úteis. Meu site carrega muito mais rápido agora.",
            date: "07 Fev 2025"
        },
    ];

    const commentsPerPage = 3;
    const indexOfLastComment = recentCommentsCurrentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = allComments.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(allComments.length / commentsPerPage);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        async function fetchData() {
            try {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", session?.user?.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const userData = doc.data() as UserData;
                    const { id, ...rest } = userData;
                    return { id: doc.id, ...rest };
                } else {
                    return null;
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                return null;
            }
        }

        async function loadData() {
            const data = await fetchData();
            setUser(data);
            setEditedUser(data);
        }

        loadData();
    }, [session, router, status]);

    console.log(user);

    if (status === "loading") {
        return <div>Carregando...</div>;
    }

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleShareProfile = () => {
        navigator.clipboard.writeText(`https://ifcode.com.br/perfil/${user?.id}`);
        alert("Link do perfil copiado para a área de transferência!");
    };

    const handleCreatePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            title: postTitle,
            content: postContent,
            type: postType
        });
        setPostTitle("");
        setPostContent("");
    };

    const goToNextPage = () => setRecentCommentsCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setRecentCommentsCurrentPage(prev => Math.max(prev - 1, 1));

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return "Data desconhecida";

        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses são de 0 a 11
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            console.error("Erro ao formatar a data:", error);
            return "Data inválida";
        }
    };


    return (
        <div className="container mx-auto py-6 px-4 lg:px-8">
            <div className="grid gap-6">
                {/* User Header */}
                <Card className="overflow-hidden bg-white shadow-md">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
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
                                    <h2 className="text-2xl font-bold">{user?.name}</h2>
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
                            </div>

                            <div className="flex gap-2 mt-4 md:mt-0 md:self-start">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleShareProfile}
                                    className="flex items-center gap-1"
                                >
                                    <ShareIcon className="h-4 w-4" />
                                    Compartilhar
                                </Button>

                                {user?.fullData ? (
                                    <Link href="/edit-data">
                                    <Button variant="default" size="sm" className="flex items-center gap-1">
                                        <PencilIcon className="h-4 w-4" />
                                        Editar perfil
                                    </Button>
                                </Link>
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
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Criar Nova Publicação</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreatePostSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="post-title">Título</Label>
                                <Input
                                    id="post-title"
                                    placeholder="Digite o título da sua publicação"
                                    value={postTitle}
                                    onChange={(e) => setPostTitle(e.target.value)}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label>Conteúdo</Label>
                                <Tabs defaultValue="text" className="w-full mt-2">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="text">Texto</TabsTrigger>
                                        <TabsTrigger value="code">
                                            <Code className="h-4 w-4 mr-1" />
                                            Código
                                        </TabsTrigger>
                                        <TabsTrigger value="image">
                                            <ImageIcon className="h-4 w-4 mr-1" />
                                            Imagem
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="text" className="mt-2">
                                        <Textarea
                                            placeholder="Escreva o conteúdo da sua publicação aqui..."
                                            value={postContent}
                                            onChange={(e) => setPostContent(e.target.value)}
                                            className="min-h-32"
                                        />
                                    </TabsContent>

                                    <TabsContent value="code" className="mt-2">
                                        <Textarea
                                            placeholder="Cole ou escreva seu código aqui..."
                                            value={postContent}
                                            onChange={(e) => setPostContent(e.target.value)}
                                            className="min-h-32 font-mono"
                                        />
                                        <div className="mt-2">
                                            <Label htmlFor="language" className="text-sm">Linguagem</Label>
                                            <Select>
                                                <SelectTrigger id="language" className="w-full mt-1">
                                                    <SelectValue placeholder="Selecione a linguagem" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="javascript">JavaScript</SelectItem>
                                                    <SelectItem value="typescript">TypeScript</SelectItem>
                                                    <SelectItem value="python">Python</SelectItem>
                                                    <SelectItem value="java">Java</SelectItem>
                                                    <SelectItem value="csharp">C#</SelectItem>
                                                    <SelectItem value="cpp">C++</SelectItem>
                                                    <SelectItem value="php">PHP</SelectItem>
                                                    <SelectItem value="ruby">Ruby</SelectItem>
                                                    <SelectItem value="go">Go</SelectItem>
                                                    <SelectItem value="other">Outra</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="image" className="mt-2">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                                            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500 mb-2">Arraste e solte uma imagem aqui ou clique para selecionar</p>
                                            <Button variant="outline" size="sm">Selecionar Imagem</Button>
                                        </div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="image-upload"
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="w-1/3">
                                    <Label htmlFor="post-type">Tipo de Publicação</Label>
                                    <Select value={postType} onValueChange={setPostType}>
                                        <SelectTrigger id="post-type" className="mt-1">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="article">Artigo</SelectItem>
                                            <SelectItem value="tutorial">Tutorial</SelectItem>
                                            <SelectItem value="question">Pergunta</SelectItem>
                                            <SelectItem value="discussion">Discussão</SelectItem>
                                            <SelectItem value="project">Projeto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button type="submit" className="flex items-center gap-2">
                                    <Send className="h-4 w-4" />
                                    Publicar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* User Stats */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Estatísticas do Usuário</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="rounded-lg bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                            <h3 className="text-2xl font-bold">{stat.value.toLocaleString()}</h3>
                                            {stat.trend && (
                                                <p className={`text-xs ${stat.trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                                                    {stat.trend.positive ? '+' : ''}{stat.trend.value}% desde o último mês
                                                </p>
                                            )}
                                        </div>
                                        <div className="rounded-full bg-primary/10 p-2">
                                            {stat.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Posts (Placeholder) */}
                    <Card className="h-full">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl font-semibold">Posts Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Conteúdo de posts recentes...</p>
                        </CardContent>
                    </Card>

                    {/* Recent Comments */}
                    <Card className="h-full">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl font-semibold">Últimos Comentários</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {currentComments.map(comment => (
                                    <div key={comment.id} className="rounded-lg border p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Link href={`/posts/${comment.postId}`} className="text-sm font-medium text-primary hover:underline">
                                                {comment.postTitle}
                                            </Link>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {comment.date}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{comment.content}</p>

                                        <div className="flex items-center mt-2">
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs font-medium">{comment.author.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-gray-500">
                                    Página {recentCommentsCurrentPage} de {totalPages}
                                </p>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={goToPrevPage}
                                        disabled={recentCommentsCurrentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={goToNextPage}
                                        disabled={recentCommentsCurrentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}