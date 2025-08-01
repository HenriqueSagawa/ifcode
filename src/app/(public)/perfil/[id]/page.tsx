'use client'

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { FaGithub, FaShareAlt, FaArrowLeft } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import { Spinner } from "@heroui/spinner";
import { ArrowLeft, Calendar, MessageSquare, ThumbsUp } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, FC } from "react";
import { useSession } from "next-auth/react";
import { addToast } from "@heroui/toast";
import { PostsProps } from "@/types/posts";

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

const getBrowser = () => {
  if (typeof navigator === 'undefined') return "ssr";
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  if (userAgent.indexOf("Edg") > -1) return "Edge";
  if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) return "Chrome";
  if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) return "Safari";
  return "unknown";
};

const RECOMMENDED_BROWSER = "Chrome";

const BrowserRecommendationBanner: FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentBrowser = getBrowser();
    if (currentBrowser !== "ssr" && currentBrowser !== RECOMMENDED_BROWSER) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      backgroundColor: '#ffc107',
      color: '#212529',
      padding: '12px',
      textAlign: 'center',
      fontSize: '14px',
      position: 'sticky',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      Para uma experiência otimizada, recomendamos o uso do navegador **{RECOMMENDED_BROWSER}**.
      <button 
        onClick={() => setIsVisible(false)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#212529',
          marginLeft: '20px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
        &times;
      </button>
    </div>
  );
};

function useUserProfile(id: string | string[] | undefined) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [posts, setPosts] = useState<PostsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    };

    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [userResponse, postsResponse] = await Promise.all([
          fetch(`/api/users/${id}`),
          fetch("/api/posts")
        ]);

        if (!userResponse.ok) {
          throw new Error("Erro ao carregar o perfil do usuário.");
        }
        
        const userData = await userResponse.json();
        setUser(userData);

        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          const filteredPosts = postsData.posts.filter((post: PostsProps) => post.userId === id);
          setPosts(filteredPosts);
        } else {
           console.warn("Não foi possível carregar os posts.");
        }

      } catch (err: any) {
        setError(err.message || 'Não foi possível carregar o perfil. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  return { user, posts, loading, error };
}

function formatDate(timestamp: any): string {
    if (!timestamp) return "Data desconhecida";
    try {
      const date = timestamp.seconds 
        ? new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
        : new Date(timestamp);
      return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return "Data inválida";
    }
}

const ProfileHeader: FC<{ user: UserProps, onShare: () => void }> = ({ user, onShare }) => (
  <>
    <div className="relative">
      <Image src={user.bannerImage} alt={`Banner de ${user.name}`} width={896} height={160} className="w-full h-40 object-cover rounded-lg" priority />
      <div className="absolute bottom-[-40px] left-4 w-24 h-24 border-4 border-white rounded-full overflow-hidden">
        <Image src={user.profileImage} alt={`Foto de perfil de ${user.name}`} width={96} height={96} className="object-cover w-full h-full" />
      </div>
    </div>
    <div className="mt-12 p-4 text-center">
      <h1 className="text-2xl font-bold">{user.name} {user.lastName}</h1>
      <p className="text-gray-500">Membro desde {new Date(user.createdAt).toLocaleDateString()}</p>
      <p className="mt-2 text-gray-700">{user.bio}</p>
      <div className="flex justify-center gap-4 mt-4">
        <Link href={`mailto:${user.email}`} className="text-gray-600"><MdEmail size={24} /></Link>
        <Link href={user.github} target="_blank" rel="noopener noreferrer" className="text-gray-600"><FaGithub size={24} /></Link>
        <Link href={`tel:${user.phone}`} className="text-gray-600"><MdPhone size={24} /></Link>
      </div>
      <Button variant="shadow" color="success" className="mt-4" onPress={onShare} startContent={<FaShareAlt />}>
        Compartilhar Perfil
      </Button>
    </div>
  </>
);

const SkillsCard: FC<{ skills: string[] }> = ({ skills }) => (
  <Card className="mt-6 p-4">
    <h2 className="text-xl font-semibold">Habilidades</h2>
    <div className="flex flex-wrap gap-2 mt-2">
      {skills?.map((skill, index) => (
        <span key={index} className="bg-gray-200 text-zinc-900 px-3 py-1 rounded-full text-sm">
          {skill}
        </span>
      ))}
    </div>
  </Card>
);

const RecentPosts: FC<{ posts: PostsProps[], userImage: string, onPostClick: (postId: string) => void }> = ({ posts, userImage, onPostClick }) => (
  <Card className="mt-6 p-4">
    <h2 className="text-xl font-semibold">Posts Recentes</h2>
    <div className="mt-2 space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.postId} onClick={() => post.postId && onPostClick(post.postId)} className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200">
            <Avatar src={userImage} />
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(post.createdAt)}</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.comments?.length || 0}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {Array.isArray(post.likes) ? post.likes.length : 0}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Nenhum post encontrado.</p>
      )}
    </div>
  </Card>
);

const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center">
        <Spinner color="success" label="Buscando dados do perfil..." size="lg" />
    </div>
);

const ErrorState: FC<{ message: string, onRetry: () => void }> = ({ message, onRetry }) => (
     <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Ocorreu um Erro</h2>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
        <Button color="primary" onPress={onRetry} className="mt-6">Voltar para a página inicial</Button>
    </div>
);

const IncompleteProfileState = () => (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mt-12 mb-4">Este usuário não completou o cadastro :(</h1>
        <Link href="/">
            <Button color="success" variant="shadow" startContent={<ArrowLeft />}> Voltar ao início</Button>
        </Link>
    </div>
);

export default function ProfilePage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, posts, loading, error } = useUserProfile(id);

  const shareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      title: "URL Copiada!",
      description: "A URL do perfil foi copiada para a área de transferência.",
      color: "success"
    });
  };

  const handlePostNavigation = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => router.push('/')} />;
  if (!user) return <ErrorState message="Usuário não encontrado." onRetry={() => router.push('/')} />;
  if (user.fullData === false) return <IncompleteProfileState />;

  return (
    <>
      <BrowserRecommendationBanner />
      <div className="max-w-4xl mx-auto p-4">
        <Button color="default" className="my-4" onPress={() => router.back()}>
          <FaArrowLeft /> Voltar
        </Button>

        <ProfileHeader user={user} onShare={shareProfile} />
        
        {user.skills && user.skills.length > 0 && <SkillsCard skills={user.skills} />}
        
        {posts && <RecentPosts posts={posts} userImage={user.profileImage} onPostClick={handlePostNavigation} />}
      </div>
    </>
  );
}
