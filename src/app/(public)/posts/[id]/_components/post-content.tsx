import { AiOutlineCode } from "react-icons/ai"
import { CodeBlock } from "./code-block"
import type { PostProps } from "@/types/posts"

interface PostContentProps {
  post: PostProps;
}

export const PostContent = ({ post }: PostContentProps) => {
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
              <div key={index} className="rounded-lg overflow-hidden border border-gray-800 group cursor-pointer">
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
    </div>
  )
}