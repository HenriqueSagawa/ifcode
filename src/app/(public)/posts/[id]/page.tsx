import { notFound } from 'next/navigation'
import PostPageContent from './_components/postPage-content'
import { getPostPageData } from './_actions/post-actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { post, comments, error } = await getPostPageData(params.id)

  const session = await getServerSession(authOptions)
  const userId = session?.user.id;
  const userImage = session?.user.image;

  if (error || !post) {
    notFound()
  }

  return <PostPageContent userImage={userImage as string} userId={userId as string} initialPost={post} initialComments={comments} postId={params.id} />
}