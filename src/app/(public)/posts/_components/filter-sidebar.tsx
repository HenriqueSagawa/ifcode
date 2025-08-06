"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { LanguageIcon } from "./language-icons"
import type { postType } from "@/types/posts"

interface Filters {
  type: postType[]
  language: string[]
  dateRange: string
  sortBy: string
}

interface FilterSidebarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const postTypes: { value: postType; label: string }[] = [
    { value: "tutorial", label: "Tutorial" },
    { value: "article", label: "Artigo" },
    { value: "question", label: "Pergunta" },
    { value: "discussion", label: "Discussão" },
    { value: "project", label: "Projeto" },
  ]

  const languages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "csharp",
    "php",
    "ruby",
    "go",
    "rust",
    "swift",
    "kotlin",
    "dart",
    "html",
    "css",
    "react",
    "nextjs",
    "vue",
    "angular",
    "svelte",
    "nodejs",
    "django",
    "express",
    "laravel",
    "springboot",
    "flask",
    "tailwindcss",
    "bootstrap",
    "sass",
    "scss",
    "mui",
    "postgresql",
    "mongodb",
    "mysql",
    "redis",
    "git",
    "docker",
    "graphql",
    "firebase",
    "supabase",
    "vercel",
    "netlify",
  ]

  const sortOptions = [
    { value: "recent", label: "Mais recentes" },
    { value: "likes", label: "Mais curtidos" },
    { value: "title", label: "Título (A-Z)" },
  ]

  const handleTypeChange = (type: postType, checked: boolean) => {
    const newTypes = checked ? [...filters.type, type] : filters.type.filter((t) => t !== type)

    onFiltersChange({
      ...filters,
      type: newTypes,
    })
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    const newLanguages = checked ? [...filters.language, language] : filters.language.filter((l) => l !== language)

    onFiltersChange({
      ...filters,
      language: newLanguages,
    })
  }

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value,
    })
  }

  return (
    <div className="bg-gray-900 border border-gray-700 !rounded sticky top-24 h-[calc(100vh-7rem)] flex flex-col">
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-green-400">Filtros</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-4">
          {/* Sort */}
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-3 block">Ordenar por</Label>
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-gray-700" />

          {/* Post Types */}
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-3 block">Tipo de Post</Label>
            <div className="space-y-3">
              {postTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.type.includes(type.value)}
                    onCheckedChange={(checked) => handleTypeChange(type.value, checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor={`type-${type.value}`} className="text-sm text-gray-300 cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Languages */}
          <div>
            <Label className="text-sm font-medium text-gray-300 mb-3 block">Tecnologias</Label>
            <div className="space-y-3">
              {languages.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lang-${language}`}
                    checked={filters.language.includes(language)}
                    onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label
                    htmlFor={`lang-${language}`}
                    className="text-sm text-gray-300 cursor-pointer flex items-center gap-2"
                  >
                    <LanguageIcon language={language} />
                    <span className="capitalize">{language}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
