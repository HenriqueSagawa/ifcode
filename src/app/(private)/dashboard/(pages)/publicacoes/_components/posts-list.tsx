import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "./post-card"
import type { PostProps } from "@/types/posts"
import Link from "next/link"

interface PostsListProps {
  posts: PostProps[]
}

export function PostsList({ posts }: PostsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seus Posts</CardTitle>
        <CardDescription>Gerencie e visualize suas publicações</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <Link href={`/dashboard/publicacoes/${post.id}`} key={post.id} className="block">
              <PostCard key={post.id} post={post} />
            </Link>

          ))}
        </div>
      </CardContent>
    </Card>
  )
}
