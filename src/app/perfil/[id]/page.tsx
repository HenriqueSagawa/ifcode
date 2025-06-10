'use client'

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Avatar } from "@heroui/avatar"
import { FaGithub, FaShareAlt } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import Link from "next/link";
import { Spinner } from "@heroui/spinner";
import { ArrowLeft, Calendar, MessageSquare, ThumbsUp } from "lucide-react";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { addToast } from "@heroui/toast";
import { FaArrowLeft } from "react-icons/fa";
import { PostsProps } from "@/types/posts";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProps {
  name: string,
  id: string,
  email: string,
  phone: string,
  github: string,
  profileImage: string,
  bannerImage: string,
  createdAt: Date,
  bio: string,
  birthDate: string,
  fullData?: any,
  lastName: string,
  password: string,
  profession: string,
  skills: string[]
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProps>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [posts, setPosts] = useState<PostsProps[]>();

  const router = useRouter();
  const { data: session, status } = useSession();
  const { id } = useParams();

  useEffect(() => {

    async function fetchData() {
      try {
        setLoading(true);

        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
          throw new Error("Erro ao carregar o perfil");
        }

        const data = await response.json();

        setUser(data);


        const fetchPost = await fetchPosts();

        const dataPost = fetchPost.posts;


        //@ts-ignore
        const filteredPosts = dataPost.filter(post => post.userId === id);


        setPosts(filteredPosts);


      } catch (err) {
        setError('Não foi possível carregar o perfil. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts");

        const data = response.json();

        return data;
      } catch (error) {
        console.log("Erro ao buscar posts", error)
      }
    }

    fetchData();


  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner color="success" label="Seja paciente! Não quebre o monitor" size="lg" />
      </div>
    );
  }

  if (user?.fullData === false) {
    return (
      <div className="w-full flex flex-col items-center">
        <h1 className="text-2xl font-semibold mt-12 mb-4">Este usuário não completou o cadastro :(</h1>
        <Link href="/">
          <Button color="success" variant="shadow"><ArrowLeft /> Voltar ao início</Button>
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Erro</h2>
        <p className="text-gray-700 dark:text-gray-300">{error || 'Usuário não encontrado'}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Voltar para a página inicial
        </button>
      </div>
    );
  }

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handlePostNavigation = (postId: string) => {
    addToast({
      title: "Navegando para o post",
      description: "Redirecionando para o conteúdo completo...",
      color: "warning"
    });
    router.push(`/posts/${postId}`);
  };

  const formatDate = (createdAt: string) => (timestamp: any): string => {
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


  return (
    <div className="max-w-4xl mx-auto p-4">


      <Button color="default" className="my-4" onPress={() => router.back()} ><FaArrowLeft /> Voltar</Button>


      <div className="relative">
        <img
          src={user?.bannerImage}
          alt={`Banner de ${user?.name}`}
          className="w-full h-40 object-cover rounded-lg"
        />
        <Avatar
          src={user?.profileImage}
          alt={`Foto de perfil do usuário ${user?.name}`}
          className="absolute bottom-[-40px] left-4 w-24 h-24 border-4 border-white rounded-full"
        />
      </div>
      <div className="mt-12 p-4 text-center">
        <h1 className="text-2xl font-bold">
          {user?.name} {user?.lastName}
        </h1>
        <p className="text-gray-500">Membro desde {new Date(user?.createdAt ?? '').toLocaleDateString()}</p>
        <p className="mt-2 text-gray-700">{user?.bio}</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="" className="text-gray-600">
            <MdEmail size={24} />
          </Link>
          <Link href='' target="_blank" className="text-gray-600">
            <FaGithub size={24} />
          </Link>
          <Link href='' className="text-gray-600">
            <MdPhone size={24} />
          </Link>
        </div>
        <Button
          variant="shadow"
          color="success"
          className="mt-4"
          onPress={() => {
            shareProfile();
            addToast({
              title: "Url do Perfil",
              description: "Url do perfil copiado com sucesso!",
              color: "success"
            })
          }}
          startContent={<FaShareAlt />}
        >
          Compartilhar Perfil
        </Button>
      </div>
      <Card className="mt-6 p-4">
        <h2 className="text-xl font-semibold">Habilidades</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {user?.skills.map((skill, index) => (
            <span key={index} className="bg-gray-200 text-zinc-900 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </Card>
      <Card className="mt-6 p-4">
        <h2 className="text-xl font-semibold">Posts Recentes</h2>
        <div className="mt-2 space-y-4">
          {(posts ?? []).length > 0 ? (
            posts?.map((post) => (
              <div
                key={post.postId}
                onClick={() => post?.postId && handlePostNavigation(post.postId)}
                className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              >
                <Avatar
                  src={user?.profileImage}
                  className=""
                />
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate('')(post.createdAt)}
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
          ) : (
            <p className="text-gray-500">Nenhum post encontrado.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
