"use client"

import { useState, useMemo, useEffect } from "react"
import PostCard from "./post-card"
import FilterSidebar from "./filter-sidebar"
import { PostsPageSkeleton } from "./post-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AiOutlineSearch } from "react-icons/ai"
import { IoClose } from "react-icons/io5"
import { HiOutlineFilter } from "react-icons/hi"
import { Plus, PenTool } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { PostProps, postType } from "@/types/posts"
import { getAllPostsWithAuthors, PostWithAuthor } from "../_actions/get-posts"

interface Filters {
  type: postType[]
  language: string[]
  dateRange: string
  sortBy: string
}

export function PostsPageContent({ userId }: { userId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [filters, setFilters] = useState<Filters>({
    type: [],
    language: [],
    dateRange: "",
    sortBy: "recent",
  })

  const handleCreatePost = () => {
    if (session?.user) {
      // Usuário logado - vai para dashboard
      router.push("/dashboard/publicacoes")
    } else {
      // Usuário não logado - vai para login
      router.push("/login")
    }
  }

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true)
        setError(null)
        const postsData = await getAllPostsWithAuthors()
        setPosts(postsData)
      } catch (err) {
        console.error("Erro ao carregar posts:", err)
        setError("Erro ao carregar posts. Tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    let filtered = [...posts]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter((post) => filters.type.includes(post.type))
    }

    // Language filter
    if (filters.language.length > 0) {
      filtered = filtered.filter((post) => filters.language.includes(post.programmingLanguage))
    }

    // Sort
    switch (filters.sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "likes":
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return filtered
  }, [searchTerm, filters, posts])

  useEffect(() => {
    // Sempre voltar para a página 1 quando filtros/termo mudarem
    setCurrentPage(1)
  }, [searchTerm, filters])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredPosts.length / pageSize))
  }, [filteredPosts.length])

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredPosts.slice(start, end)
  }, [filteredPosts, currentPage])

  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, filteredPosts.length)

  const getActiveFiltersCount = () => {
    return filters.type.length + filters.language.length + (filters.dateRange ? 1 : 0) + (searchTerm ? 1 : 0)
  }

  const clearFilters = () => {
    setFilters({
      type: [],
      language: [],
      dateRange: "",
      sortBy: "recent",
    })
    setSearchTerm("")
  }

  const removeFilter = (filterType: string, value: string) => {
    if (filterType === "search") {
      setSearchTerm("")
    } else if (filterType === "type") {
      setFilters((prev) => ({
        ...prev,
        type: prev.type.filter((t) => t !== value),
      }))
    } else if (filterType === "language") {
      setFilters((prev) => ({
        ...prev,
        language: prev.language.filter((l) => l !== value),
      }))
    }
  }

  // Loading state - Usando skeleton
  if (loading) {
    return <PostsPageSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground" style={{ zIndex: 10 }}>
        <header className="border-b border-gray-700 bg-background/50 backdrop-blur-sm sticky top-0 -z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-green-400">DevForum</h1>
                <p className="text-muted-foreground text-xs sm:text-sm">Comunidade de desenvolvedores</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-black text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
            >
              Tentar novamente
            </Button>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        <Button
          onClick={handleCreatePost}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          {session?.user ? (
            <PenTool className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-muted dark:bg-zinc-950 text-foreground">
      {/* Header */}
      <header className="border-b border-gray-700 bg-background/50 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4">
          {/* Top Row - Title and Mobile Filter Button */}
          <div className="flex items-center justify-between mb-4 sm:mb-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-green-400">IFCode</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">Comunidade de desenvolvedores</p>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden border-green-600 text-green-400 hover:bg-green-600 hover:text-black bg-transparent"
              onClick={() => setShowFilters(!showFilters)}
            >
              <HiOutlineFilter className="w-4 h-4 mr-2" />
              Filtros
              {getActiveFiltersCount() > 0 && (
                <span className="ml-2 bg-green-600 text-black rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </Button>
          </div>

          {/* Search Bar - Full width on mobile, centered on desktop */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex-1 sm:max-w-md sm:mx-8">
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar publicações, autores..."
                  className="pl-10 w-full text-sm sm:text-base mt-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Active Filters - Scrollable horizontally on mobile */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Filtros ativos:</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-green-400 text-xs sm:text-sm ml-auto sm:ml-0" 
                  onClick={clearFilters}
                >
                  Limpar todos
                </Button>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {searchTerm && (
                  <Badge variant="secondary" className="bg-green-900 text-green-100 text-xs whitespace-nowrap flex-shrink-0">
                    Busca: {searchTerm}
                    <button className="ml-1 hover:text-green-400" onClick={() => removeFilter("search", "")}>
                      <IoClose className="w-3 h-3" />
                    </button>
                  </Badge>
                )}

                {filters.type.map((type) => (
                  <Badge key={type} variant="secondary" className="bg-green-900 text-green-100 text-xs whitespace-nowrap flex-shrink-0">
                    {type}
                    <button className="ml-1 hover:text-green-400" onClick={() => removeFilter("type", type)}>
                      <IoClose className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}

                {filters.language.map((lang) => (
                  <Badge key={lang} variant="secondary" className="bg-green-900 text-green-100 text-xs whitespace-nowrap flex-shrink-0">
                    {lang}
                    <button className="ml-1 hover:text-green-400" onClick={() => removeFilter("language", lang)}>
                      <IoClose className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Create Post Button */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-background border border-green-500/20 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-500" />
                {session?.user ? "Criar nova publicação" : "Participe da comunidade"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {session?.user 
                  ? "Compartilhe seu conhecimento com outros desenvolvedores"
                  : "Faça login para criar publicações"
                }
              </p>
            </div>
            <Button
              onClick={handleCreatePost}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              {session?.user ? (
                <>
                  <PenTool className="h-4 w-4" />
                  Criar Post
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Fazer Login
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Sidebar - Collapsible */}
          <div className={`
            ${showFilters ? 'flex' : 'hidden'} 
            sm:${showFilters ? 'flex' : 'hidden'}
            lg:block lg:w-80 lg:flex-shrink-0
            fixed lg:static inset-0 lg:inset-auto items-center justify-center
            z-50 lg:z-auto overflow-y-auto lg:overflow-visible
            p-0 lg:p-0
          `}>
            <div className="w-[90%] max-w-md bg-background/95 backdrop-blur-sm shadow-lg border border-border rounded p-4 lg:w-auto lg:max-w-none lg:bg-transparent lg:shadow-none lg:border-0 lg:rounded-none lg:p-0">
              {/* Mobile Filter Header */}
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2 className="text-lg font-semibold text-green-400">Filtros</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="text-muted-foreground hover:text-green-400"
                >
                  <IoClose className="w-5 h-5" />
                </Button>
              </div>
              
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <div className="text-muted-foreground text-sm sm:text-base">
                {filteredPosts.length} {filteredPosts.length === 1 ? "publicação encontrada" : "publicações encontradas"}
                {filteredPosts.length > 0 && (
                  <span className="ml-2 text-xs">(mostrando {startIndex}–{endIndex})</span>
                )}
              </div>
              
              {/* Desktop Filter Button */}
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex lg:hidden border-green-600 text-green-400 hover:bg-green-600 hover:text-black bg-transparent self-start"
                onClick={() => setShowFilters(!showFilters)}
              >
                <HiOutlineFilter className="w-4 h-4 mr-2" />
                Filtros
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 bg-green-600 text-black rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </Button>
            </div>

            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {paginatedPosts.map((post) => (
                  <PostCard key={post.id} post={post} userId={userId} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="text-muted-foreground mb-4">
                  <AiOutlineSearch className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-base sm:text-lg">Nenhum post encontrado</p>
                  <p className="text-sm">Tente ajustar os filtros ou termos de busca</p>
                </div>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-600 hover:text-black bg-transparent text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </Button>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredPosts.length > 0 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-xs text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    Primeiro
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Próxima
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    Última
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-[65px] right-4 z-50 sm:hidden">
        <Button
          onClick={handleCreatePost}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {session?.user ? (
            <PenTool className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Backdrop for mobile filters */}
      {showFilters && (
        <div 
          className="fixed inset-0 bg-background/50 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
