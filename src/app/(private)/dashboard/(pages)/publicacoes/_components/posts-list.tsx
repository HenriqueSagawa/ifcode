import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "./post-card"
import type { PostProps } from "@/types/posts"

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
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
