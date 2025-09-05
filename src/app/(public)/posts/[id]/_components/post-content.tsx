import { AiOutlineCode } from "react-icons/ai"
import { CodeBlock } from "./code-block"
import type { PostProps } from "@/types/posts"
import { useEffect, useState } from "react"

interface PostContentProps {
  post: PostProps;
}

export const PostContent = ({ post }: PostContentProps) => {
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImageUrl(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="mb-8">
      {/* Content */}
      <div className="prose prose-invert prose-green max-w-none mb-8">
        <div className="text-gray-300 leading-relaxed whitespace-pre-line">{post.content}</div>
      </div>

      {/* Code Snippet */}
      {post.codeSnippet && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AiOutlineCode className="w-5 h-5 text-green-400" />
            Código de Exemplo
          </h3>
          <CodeBlock code={post.codeSnippet} language={post.programmingLanguage} />
        </div>
      )}

      {/* Images */}
      {post.imagesUrls && post.imagesUrls.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Imagens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {post.imagesUrls.map((url, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden border border-gray-800 group cursor-pointer"
                onClick={() => setActiveImageUrl(url)}
                aria-label={`Abrir imagem ${index + 1}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActiveImageUrl(url)
                }}
              >
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActiveImageUrl(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-5xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute -top-2 -right-2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur"
              onClick={() => setActiveImageUrl(null)}
              aria-label="Fechar imagem"
            >
              ✕
            </button>
            <img
              src={activeImageUrl}
              alt="Imagem ampliada"
              className="w-full h-auto max-h-[90vh] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}
