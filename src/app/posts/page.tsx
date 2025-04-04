'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from '@heroui/button';
import { Select, SelectItem } from "@heroui/select";
import { Input } from '@heroui/input';
import { Chip } from '@heroui/chip';
import { Pagination } from "@heroui/pagination";
import { SearchIcon, BookOpenIcon, TrendingUpIcon, PlusIcon, CodeIcon } from 'lucide-react';

import { 
  FaJs, FaPython, FaJava, FaPhp, FaCode
} from "react-icons/fa";
import { DiRuby } from "react-icons/di";

import { SiTypescript, SiCplusplus, SiGo } from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import { Avatar } from '@heroui/avatar';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LikeButton } from '@/components/LikeButton';


enum SortOption {
  TITLE_ASC = 'title_asc',
  TITLE_DESC = 'title_desc',
  DATE_NEWEST = 'date_newest',
  DATE_OLDEST = 'date_oldest',
  AUTHOR_ASC = 'author_asc',
  AUTHOR_DESC = 'author_desc',
  MOST_LIKED = 'most_liked'
}

interface PostsProps {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    codeLenguage?: string | null;
    codeContent?: string | null;
    userId: string;
    email: string;
    images?: string[] | null;
    likes: string[];
    comments: any[];
    author?: string;
    type?: string;
    authorImage?: string;
}

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<PostsProps[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostsProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.DATE_NEWEST);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  const POSTS_PER_PAGE = 9;

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch("/api/posts");

        if (!response.ok) {
          throw new Error("Falha ao carregar posts");
        }

        const data = await response.json();
        setPosts(data.posts);
        setFilteredPosts(data.posts);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!posts.length) return;

    let result = [...posts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.author?.toLowerCase().includes(query) ||
          (post.codeLenguage && post.codeLenguage.toLowerCase().includes(query))
      );
    }

    if (selectedLanguage && selectedLanguage !== "all") {
      result = result.filter(post =>
        post.codeLenguage && post.codeLenguage.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }

    if (selectedType && selectedType !== "all") {
      result = result.filter(post =>
        post.type && post.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortOption) {
      case SortOption.TITLE_ASC:
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case SortOption.TITLE_DESC:
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case SortOption.DATE_NEWEST:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case SortOption.DATE_OLDEST:
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case SortOption.AUTHOR_ASC:
        result.sort((a, b) => {
          const authorA = a.author || a.title;
          const authorB = b.author || b.title;
          return authorA.localeCompare(authorB);
        });
        break;
      case SortOption.AUTHOR_DESC:
        result.sort((a, b) => {
          const authorA = a.author || a.title;
          const authorB = b.author || b.title;
          return authorB.localeCompare(authorA);
        });
        break;
      case SortOption.MOST_LIKED:
        result.sort((a, b) => b.likes.length - a.likes.length);
        break;
    }

    setFilteredPosts(result);
    setCurrentPage(1);
  }, [posts, searchQuery, sortOption, selectedLanguage, selectedType]);


  const allLanguages: string[] = ["javascript", "typescript", "python", "java", "c#", "c++", "php", "ruby", "go", "other"];

  const allTypes: string[] = ["Artigo", "Tutorial", "Pergunta", "Discussão", "Projeto"];

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getPostTypeColor = (type: string) => {
    const lowerType = type?.toLowerCase() || '';

    switch (lowerType) {
      case 'tutorial': return 'success';
      case 'artigo': return 'primary';
      case 'pergunta': return 'warning';
      case 'discussão': return 'secondary';
      case 'projeto': return 'danger';
      default: return 'default';
    }
  };

  // Função para obter o ícone da linguagem com a cor correspondente
  const getLanguageIcon = (language: string) => {
    const lowerLang = language?.toLowerCase() || '';
    
    switch (lowerLang) {
      case 'javascript':
        return <FaJs size={14} className="mr-1" style={{ color: '#F7DF1E' }} />;
      case 'typescript':
        return <SiTypescript size={14} className="mr-1" style={{ color: '#3178C6' }} />;
      case 'python':
        return <FaPython size={14} className="mr-1" style={{ color: '#3776AB' }} />;
      case 'java':
        return <FaJava size={14} className="mr-1" style={{ color: '#ED8B00' }} />;
      case 'c#':
        return <TbBrandCSharp size={14} className="mr-1" style={{ color: '#239120' }} />;
      case 'c++':
        return <SiCplusplus size={14} className="mr-1" style={{ color: '#00599C' }} />;
      case 'php':
        return <FaPhp size={14} className="mr-1" style={{ color: '#777BB4' }} />;
      case 'ruby':
        return <DiRuby size={14} className="mr-1" style={{ color: '#CC342D' }} />;
      case 'go':
        return <SiGo size={14} className="mr-1" style={{ color: '#00ADD8' }} />;
      case 'other':
      default:
        return <FaCode size={14} className="mr-1" style={{ color: '#718096' }} />;
    }
  };

  // Função para obter a cor do chip da linguagem
  const getLanguageColor = (language: string) => {
    const lowerLang = language?.toLowerCase() || '';
    
    switch (lowerLang) {
      case 'javascript': return 'warning';
      case 'typescript': return 'primary';
      case 'python': return 'secondary';
      case 'java': return 'warning';
      case 'c#': return 'success';
      case 'c++': return 'primary';
      case 'php': return 'secondary';
      case 'ruby': return 'danger';
      case 'go': return 'primary';
      default: return 'default';
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLanguage(null);
    setSelectedType(null);
    setSortOption(SortOption.DATE_NEWEST);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold dark:text-white text-black mb-2">Código & Desenvolvimento</h1>
              <p className="text-black/90 dark:text-white/90 text-lg">
                Tutoriais, artigos, perguntas, discussões e projetos.
              </p>
            </div>
            <div className="hidden md:flex gap-4 items-center">
              {status == "authenticated" ? (
                <Link href="/dashboard">
                  <Button
                    color="primary"
                    startContent={<PlusIcon size={18} />}
                  >
                    Publicar Post
                  </Button>
                </Link>
              ) : (
                <div className='flex flex-col gap-2'>
                  <span>
                    Faça login para publicar
                  </span>
                  <Link href="/login">
                    <Button color='primary' className='w-full'>Entrar</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      <div className="container mx-auto px-4 py-8">
        {/* Área de Filtros e Busca */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl mb-8 shadow-sm border border-gray-100 dark:border-gray-700 relative -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Campo de Busca */}
            <div className="md:col-span-3">
              <Input
                placeholder="Buscar posts..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                startContent={<SearchIcon size={18} />}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "h-10 bg-gray-50 dark:bg-gray-900"
                }}
              />
            </div>

            {/* Seletor de Ordenação */}
            <div className="md:col-span-2">
              <Select
                label="Ordenar por"
                selectedKeys={[sortOption]}
                onChange={(e: any) => setSortOption(e.target.value as SortOption)}
                className="w-full"
                size="sm"
                classNames={{
                  trigger: "bg-gray-50 dark:bg-gray-900"
                }}
              >
                <SelectItem key={SortOption.DATE_NEWEST}>
                  Mais recentes
                </SelectItem>
                <SelectItem key={SortOption.DATE_OLDEST}>
                  Mais antigos
                </SelectItem>
                <SelectItem key={SortOption.MOST_LIKED}>
                  Mais curtidos
                </SelectItem>
                <SelectItem key={SortOption.TITLE_ASC}>
                  Título (A-Z)
                </SelectItem>
                <SelectItem key={SortOption.TITLE_DESC}>
                  Título (Z-A)
                </SelectItem>
              </Select>
            </div>

            {/* Filtro de Linguagem com Ícones */}
            <div className="md:col-span-2">
              <Select
                label="Linguagem"
                selectedKeys={selectedLanguage ? [selectedLanguage] : ["all"]}
                onChange={(e: any) => setSelectedLanguage(e.target.value)}
                className="w-full"
                size="sm"
                classNames={{
                  trigger: "bg-gray-50 dark:bg-gray-900"
                }}
              >
                <>
                  <SelectItem key="all">
                    Todas as linguagens
                  </SelectItem>
                  {
                    allLanguages.map((lang) => (
                      <SelectItem 
                        key={lang}
                        startContent={getLanguageIcon(lang)}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                </>
              </Select>
            </div>

            {/* Filtro de Tipo */}
            <div className="md:col-span-3">
              <Select
                label="Tipo de post"
                selectedKeys={selectedType ? [selectedType] : ["all"]}
                onChange={(e: any) => setSelectedType(e.target.value)}
                className="w-full"
                size="sm"
                classNames={{
                  trigger: "bg-gray-50 dark:bg-gray-900"
                }}
              >
                <>
                  <SelectItem key="all">
                    Todos os tipos
                  </SelectItem>
                  {allTypes.map((type) => (
                    <SelectItem key={type}>
                      {type}
                    </SelectItem>
                  ))}
                </>
              </Select>
            </div>
          </div>

          {/* Estatísticas dos Resultados */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 flex items-center justify-between flex-wrap gap-2">
            <p>
              Exibindo {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
              {searchQuery && ` para "${searchQuery}"`}
              {selectedLanguage && selectedLanguage !== "all" && ` em ${selectedLanguage}`}
              {selectedType && selectedType !== "all" && ` do tipo ${selectedType}`}
            </p>

            {(searchQuery || (selectedLanguage && selectedLanguage !== "all") || (selectedType && selectedType !== "all")) && (
              <Button
                onClick={handleClearFilters}
                color="primary"
                variant="light"
                size="sm"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Lista de Posts */}
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <Card
                key={post.id}
                className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                <CardHeader className="flex items-start gap-3 pb-2">
                  <Link href={`perfil/${post?.userId}`}>
                    <Avatar
                      src={post?.authorImage ?? undefined}
                      size="md"
                      isBordered
                      color="primary"
                      className="flex-shrink-0 bg-white hover:brightness-75 transition-all"
                    />
                  </Link>

                  <div className="flex flex-col flex-grow">
                    <Chip
                      size="sm"
                      color={getPostTypeColor(post.type || '')}
                      variant="flat"
                      className="self-start mb-1"
                    >
                      {post.type}
                    </Chip>
                    <h2 className="text-lg font-bold line-clamp-2">{post.title}</h2>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="py-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">{post.content}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      {post.codeLenguage && (
                        <Chip
                          size="sm"
                          variant="dot"
                          color={getLanguageColor(post.codeLenguage)}
                          startContent={getLanguageIcon(post.codeLenguage)}
                        >
                          {post.codeLenguage}
                        </Chip>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <LikeButton 
                        postId={post.id}
                        userId={session?.user?.email || ''}
                        initialLikes={Array.isArray(post.likes) ? post.likes : []}
                        onLikeChange={(newLikes) => {
                          setPosts(posts.map(p => 
                            p.id === post.id ? { ...p, likes: newLikes } : p
                          ));
                        }}
                      />
                    </div>
                  </div>
                </CardBody>

                <CardFooter className="py-3 px-4 flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-full mt-2">
                    <Button
                      color="primary"
                      size="sm"
                      as="a"
                      href={`/posts/${post.id}`}
                      className="w-full"
                    >
                      Ver completo
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center my-8">
            <BookOpenIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum post encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Tente usar outros termos de busca ou remover os filtros aplicados.
            </p>
            {(searchQuery || (selectedLanguage && selectedLanguage !== "all") || (selectedType && selectedType !== "all")) && (
              <Button
                onClick={handleClearFilters}
                color="primary"
                className="mt-4"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={setCurrentPage}
              showControls
              classNames={{
                cursor: "bg-primary"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;