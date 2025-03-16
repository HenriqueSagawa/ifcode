'use client'

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "@/services/firebaseConnection";
import { doc, getDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp, where } from "firebase/firestore";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";
import Image from 'next/image'
import { Heart, X } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaArrowLeft } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";
import { addToast } from "@heroui/toast";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Timestamp } from 'firebase/firestore';



interface PostDataProps {
    author: string;
    authorImage: string;
    codeContent: string;
    codeLenguage: string;
    content: string;
    createdAt: Date | Timestamp;
    email: string;
    id: string;
    images: string[];
    likes: number;
    title: string;
    type: string;
    userImage: string;
    userId: string;
}

interface CommentProps {
    id: string;
    text: string;
    author: string;
    authorImage: string;
    createdAt: Date | Timestamp | null;
}

export default function PostPage() {
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [post, setPost] = useState<PostDataProps | null>(null);
    const [comments, setComments] = useState<CommentProps[]>([]);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState<any>(null);
    const [isLiked, setIsLiked] = useState(false);

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const { data: session, status } = useSession();
    const router = useRouter();

    const { id } = useParams();
    const dataFetched = useRef(false);

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImage("");
    };

    const fetchUser = useCallback(async () => {
        if (status === "loading" || dataFetched.current) return;


        if (status === "unauthenticated") {
            console.log("Usuário não autenticado");
            return;
        }



        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", session?.user?.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const userData = doc.data();
                setUser({ id: doc.id, ...userData });
            } else {
                console.log("Nenhum usuário encontrado com este email:", session?.user?.email);
            }
        } catch (err) {
            console.error("Erro ao buscar usuário:", err);
            addToast({
                title: "Erro ao carregar informações do usuário.",
                color: "danger",
                variant: "flat"
            });
        }
    }, [session?.user?.email, status]);

    const fetchPost = useCallback(async (postId: string) => {
        try {
            setLoading(true);
            const postRef = doc(db, "posts", postId);
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                const postData = postSnap.data() as PostDataProps;


                const updatedPostData = {
                    ...postData,
                    codeLenguage: getPrismLanguage(postData.codeLenguage as string)
                };

                setPost(updatedPostData);
                dataFetched.current = true;
                fetchComments(postId);

            } else {
                console.warn("Post não encontrado!");
                setPost(null);
            }
        } catch (err) {
            console.error("Erro ao buscar o post:", err);
            setPost(null);
            addToast({
                title: "Erro ao carregar post. Por favor, tente novamente.",
                color: "danger",
                variant: "flat"
            });
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchComments = useCallback(async (postId: string) => {
        try {
            const commentsRef = collection(db, "posts", postId, "comments");
            const q = query(commentsRef, orderBy("createdAt", "desc"));
            const commentsSnap = await getDocs(q);

            const commentsData = commentsSnap.docs.map(doc => {
                const data = doc.data();
                const createdAt = data.createdAt ? (data.createdAt as Timestamp).toDate() : null;

                return {
                    id: doc.id,
                    ...data,
                    createdAt: createdAt
                };
            }) as CommentProps[];

            setComments(commentsData);
        } catch (err) {
            console.error("Erro ao buscar comentários:", err);
            addToast({
                title: "Erro ao carregar comentarios.",
                color: "danger",
                variant: "flat"
            });
        }
    }, []);

    async function createNotification(notificationData: any) {
        try {
            const response = await fetch("/api/notifications/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(notificationData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Notificação criada!", data);
            } else {
                console.error('Erro ao criar notificação:', response.status);
            }
        } catch (error) {
            console.error('Erro ao criar notificação:', error);
            return null;
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim() || !id || !user) return;

        setCommentLoading(true);
        try {
            const commentsRef = collection(db, "posts", id as string, "comments");
            await addDoc(commentsRef, {
                text: newComment,
                author: user.name,
                authorImage: user.profileImage,
                userId: user.id,
                createdAt: serverTimestamp()
            });

            setNewComment("");
            await fetchComments(id as string);

            createNotification({
                type: "comment",
                senderName: user.name,
                senderId: user.id,
                senderAvatar: user.profileImage || "",
                receiverId: post?.id,
                postTitle: post?.title,
                postId: id,
            })

            addToast({
                title: "Comentário adicionado com sucesso!",
                color: "success",
                variant: "flat"
            });
        } catch (err) {
            console.error("Erro ao adicionar comentário:", err);
            addToast({
                title: "Erro ao adicionar o comentario.",
                color: "danger",
                variant: "flat"
            });
        } finally {
            setCommentLoading(false);
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    useEffect(() => {
        if (status !== "loading") {
            fetchUser();
        }
    }, [status, fetchUser]);

    useEffect(() => {
        if (id) {
            fetchPost(id as string);
        } else {
            console.warn("ID inválido. Não foi possível buscar o post.");
            setPost(null);
            setLoading(false);
        }
    }, [id, fetchPost]);

    function handleShareProfile() {
        navigator.clipboard.writeText(window.location.href);
        addToast({
            title: "Url do post copiado!",
            color: "success",
            variant: "flat"
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" color="primary" label="Carregando post..." />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h2 className="text-2xl font-bold mb-4">Post não encontrado</h2>
                <p className="text-gray-500 mb-6">O post que você está procurando não existe ou foi removido.</p>
                <Button color="primary" href="/"><FaArrowLeft /> Voltar para a página inicial</Button>
            </div>
        );
    }

    const formattedDate = post.createdAt
        ? (post.createdAt instanceof Timestamp
            ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true, locale: ptBR })
            : (post.createdAt instanceof Date
                ? formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ptBR })
                : "Data desconhecida"))
        : "Data desconhecida";

    function getPrismLanguage(codeLanguage: string): string {
        switch (codeLanguage) {
            case "javascript":
                return "javascript";
            case "typescript":
                return "typescript";
            case "python":
                return "python";
            case "java":
                return "java";
            case "c#":
                return "csharp";
            case "c++":
                return "cpp";
            case "php":
                return "php";
            case "ruby":
                return "ruby";
            case "go":
                return "go";
            case "other":
                return "";
            default:
                return "";
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Button color="default" className="my-4" onPress={() => router.back()}><FaArrowLeft /> Voltar</Button>
            <Card className="mb-8">
                <CardHeader className="justify-between">
                    <div className="flex gap-3">
                        <Link href={`/perfil/${post?.id}`} className="hover:brightness-75 transition-all">
                            <User
                                name={post.author}
                                avatarProps={{
                                    src: post.authorImage
                                }}
                                description={formattedDate}
                            />
                        </Link>
                    </div>
                    <Chip color="primary" variant="flat">{post.type}</Chip>
                </CardHeader>

                <CardBody>
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <p className="text-gray-700 mb-6 whitespace-pre-wrap">{post.content}</p>

                    {post.codeContent && (
                        <div className="mb-6">
                            <SyntaxHighlighter language={post.codeLenguage} style={atomDark}>
                                {post.codeContent}
                            </SyntaxHighlighter>
                        </div>
                    )}

                    {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {post.images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-[1.02]"
                                    onClick={() => openImageModal(img)}
                                >
                                    <Image
                                        src={img}
                                        width={500}
                                        height={300}
                                        alt={`Imagem ${index + 1} do post`}
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>

                <CardFooter className="flex justify-between">
                    <Button
                        color={isLiked ? "danger" : "default"}
                        variant="light"
                        startContent={<Heart fill={isLiked ? "currentColor" : "none"} />}
                        onPress={handleLike}
                    >
                        {post.likes + (isLiked ? 1 : 0)}
                    </Button>
                    <Button color="default" onPress={handleShareProfile}><FaRegShareSquare /> Compartilhar post</Button>
                    <Button color="primary" variant="light">
                        {comments.length} comentários
                    </Button>
                </CardFooter>
            </Card>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Comentários</h2>

                <div className="mb-6">
                    <Textarea
                        placeholder="Escreva seu comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        minRows={3}
                        className="mb-2"
                    />
                    <Button
                        color="primary"
                        onPress={handleAddComment}
                        isLoading={commentLoading}
                        isDisabled={!newComment.trim() || !user}
                    >
                        Publicar comentário
                    </Button>
                </div>

                <Divider className="my-4" />

                {comments.length > 0 ? (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <Card key={comment.id} className="mb-4">
                                <CardHeader>
                                    <Avatar src={comment.authorImage} className="mr-2" />
                                    <div>
                                        <p className="font-bold">{comment.author}</p>
                                        <p className="text-gray-500 text-sm">
                                            {comment.createdAt instanceof Date
                                                ? formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: ptBR })
                                                : "Data desconhecida"}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <p className="whitespace-pre-wrap">{comment.text}</p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-6">
                        Nenhum comentário ainda. Seja o primeiro a comentar!
                    </p>
                )}
            </div>

            {/* Modal de visualização da imagem */}
            <Modal
                isOpen={isImageModalOpen}
                onClose={closeImageModal}
                size="full"
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalBody className="p-0 relative">
                        <div className="relative w-full h-screen flex items-center justify-center bg-black/90">
                            <Button
                                isIconOnly
                                color="default"
                                variant="light"
                                className="absolute top-4 right-4 z-50 bg-black/50 text-white"
                                onPress={closeImageModal}
                            >
                                <X size={24} />
                            </Button>

                            {selectedImage && (
                                <div className="max-h-screen max-w-screen-lg">
                                    <Image
                                        src={selectedImage}
                                        alt="Imagem ampliada"
                                        width={1200}
                                        height={800}
                                        className="object-contain max-h-screen"
                                    />
                                </div>
                            )}
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}