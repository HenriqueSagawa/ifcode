import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PostPageContent from './_components/postPage-content'
import { getPostPageData, getPostById } from './_actions/post-actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface PostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const post = await getPostById(params.id)
    
    if (!post) {
      return {
        title: 'Post não encontrado | IFCode',
        description: 'O post que você está procurando não foi encontrado.',
      }
    }

    // Criar descrição baseada no conteúdo do post
    const description = post.content.length > 160 
      ? post.content.substring(0, 157) + '...'
      : post.content

    // Determinar o tipo de post em português
    const postTypeMap = {
      'article': 'Artigo',
      'question': 'Pergunta',
      'project': 'Projeto',
      'tutorial': 'Tutorial',
      'discussion': 'Discussão'
    }

    const postTypeLabel = postTypeMap[post.type] || 'Publicação'

    return {
      title: `${post.title} | ${postTypeLabel} | IFCode`,
      description: description,
      authors: [{ name: post.author.name }],
      keywords: [
        post.programmingLanguage,
        postTypeLabel.toLowerCase(),
        'programação',
        'desenvolvimento',
        'ifcode'
      ],
      openGraph: {
        title: post.title,
        description: description,
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: [post.author.name],
        tags: [post.programmingLanguage, postTypeLabel.toLowerCase()],
        images: post.imagesUrls.length > 0 ? [
          {
            url: post.imagesUrls[0],
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: description,
        images: post.imagesUrls.length > 0 ? [post.imagesUrls[0]] : undefined,
      },
      alternates: {
        canonical: `/posts/${params.id}`,
      },
    }
  } catch (error) {
    console.error('Erro ao gerar metadata:', error)
    return {
      title: 'Erro ao carregar post | IFCode',
      description: 'Ocorreu um erro ao carregar o post solicitado.',
    }
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