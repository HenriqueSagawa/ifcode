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
import type { PostProps, postType } from "@/types/posts"
import { getAllPostsWithAuthors, PostWithAuthor } from "../_actions/get-posts" // Ajuste o caminho

interface Filters {
  type: postType[]
  language: string[]
  dateRange: string
  sortBy: string
}

export function PostsPageContent({  userId }: { userId: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    type: [],
    language: [],
    dateRange: "",
    sortBy: "recent",
  })

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
      <div className="min-h-screen bg-black text-white " style={{ zIndex: 10 }}>
        <header className="border-b border-green-900/20 bg-black/50 backdrop-blur-sm sticky top-0">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-green-400">DevForum</h1>
                <p className="text-gray-400 text-sm">Comunidade de desenvolvedores</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-black"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-green-900/20 bg-black/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-400">IFCode</h1>
              <p className="text-gray-400 text-sm">Comunidade de desenvolvedores</p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar publicações, autores..."
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-gray-400">Filtros ativos:</span>

              {searchTerm && (
                <Badge variant="secondary" className="bg-green-900 text-green-100">
                  Busca: {searchTerm}
                  <button className="ml-1 hover:text-green-400" onClick={() => removeFilter("search", "")}>
                    <IoClose className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.type.map((type) => (
                <Badge key={type} variant="secondary" className="bg-green-900 text-green-100">
                  {type}
                  <button className="ml-1 hover:text-green-400" onClick={() => removeFilter("type", type)}>
                    <IoClose className="w-3 h-3" />
                  </button>
                </Badge>
              ))}

              {filters.language.map((lang) => (
                <Badge key={lang} variant="secondary" className="bg-green-900 text-green-100">
                  {lang}
                  <button className="ml-1 hover:text-green-400" onClick={() => removeFilter("language", lang)}>
                    <IoClose className="w-3 h-3" />
                  </button>
                </Badge>
              ))}

              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400" onClick={clearFilters}>
                Limpar todos
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters - Always visible */}
          <div className="w-80 flex-shrink-0">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-400">
                {filteredPosts.length} {filteredPosts.length === 1 ? "publicações encontrado" : "publicações encontrados"}
              </div>
            </div>

            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} userId={userId} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <AiOutlineSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nenhum post encontrado</p>
                  <p className="text-sm">Tente ajustar os filtros ou termos de busca</p>
                </div>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-600 hover:text-black bg-transparent"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}