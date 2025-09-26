import { Suspense } from "react"
import { PostDetailWrapper } from "./_components/post-detail-wrapper"
import { PostDetailSkeleton } from "./_components/post-detail-skeleton"

interface PostDetailPageProps {
  params: {
    id: string
  }
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetailWrapper postId={params.id} />
    </Suspense>
  )
}
