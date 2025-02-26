"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  ArrowUpRight,
  Clock,
  Star,
  Edit3,
  ThumbsUp,
  ImageIcon,
  Link2,
  SendHorizontal
} from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import Link from "next/link";

interface UserData {
  name: string;
  email: string;
  birthDate: string;
  phone: string;
  course: string;
  period: string;
  registration: string;
  github: string;
  linkedin: string;
  bio: string;
  profileImage: string;
  createdAt: string;
  fullData: boolean;
}

interface DashboardContentProps {
  userData: UserData | null;
}

export function DashboardContent({ userData }: DashboardContentProps) {
  const { data: session } = useSession();

  return (
    <main className="flex-1 p-6 space-y-8">
      {/* Perfil do Usuário */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
        <CardContent className="pt-8">
          <div className="flex flex-col md:flex-row items-center gap-6 relative">
            <Avatar className="w-24 h-24 border-4 border-white dark:border-black">
              <AvatarImage src={userData?.profileImage || session?.user?.image || ""} />
              <AvatarFallback className="text-2xl">
                {userData?.name?.charAt(0).toUpperCase() || session?.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{userData?.name || session?.user?.name}</h2>
              <p className="text-muted-foreground">{userData?.email || session?.user?.email}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Membro desde {new Date(userData?.createdAt || "").toLocaleDateString()}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {userData?.course} - {userData?.period}º Período
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  Matrícula: {userData?.registration}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{userData?.bio}</p>
              </div>
              <div className="flex gap-4 mt-4">
                {userData?.github && (
                  <a href={`https://github.com/${userData.github}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                    GitHub
                  </a>
                )}
                {userData?.linkedin && (
                  <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                    LinkedIn
                  </a>
                )}
                <span className="text-sm text-muted-foreground">
                  {userData?.phone}
                </span>
              </div>
            </div>
            <Button className="md:ml-auto" variant="outline">
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nova Publicação */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Publicação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userData?.profileImage || ""} />
              <AvatarFallback>
                {session?.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <input
                type="text"
                placeholder="Título da sua publicação"
                className="w-full px-3 py-2 text-lg font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground"
              />
              <Textarea
                placeholder="Compartilhe sua dúvida ou conhecimento..."
                className="min-h-[120px] resize-none bg-muted/30"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Imagem
                  </Button>
                  <Button variant="outline" size="sm">
                    <Link2 className="w-4 h-4 mr-2" />
                    Código
                  </Button>
                </div>
                <Button>
                  <SendHorizontal className="w-4 h-4 mr-2" />
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Posts Criados
            </CardTitle>
            <Edit3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              +3 este mês
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Comentários
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              +12 esta semana
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Curtidas Recebidas
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              +45 este mês
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Atividades */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <Link 
                  href={`/posts/${i}`} 
                  key={i} 
                  className="block transition-colors hover:bg-muted/70 hover:underline"
                >
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <h4 className="font-medium hover:text-primary transition-colors">
                        Como implementar autenticação no Next.js?
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Estou tentando implementar autenticação no meu projeto Next.js e...
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>15 comentários</span>
                        <span>32 curtidas</span>
                        <span>2 dias atrás</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Comentários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <Link 
                  href={`/posts/${i}#comment-${i}`} 
                  key={i}
                  className="block transition-colors hover:bg-muted/70 hover:underline"
                >
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm hover:text-primary transition-colors">
                        Você pode usar o NextAuth.js para isso, é uma ótima solução...
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>5 curtidas</span>
                        <span>1 hora atrás</span>
                        <span className="text-primary">Em: Como implementar autenticação...</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 