export interface PostsProps {
    title: string,
    content: string,
    createdAt: string,
    codeLenguage?: string | null,
    codeContent?: string | null,
    userId: string,
    id: string,
    email: string,
    images?: string[] | null,
    type: string,
    author: string,
    authorImage?: string | null
    likes: number,
    postId?: string,
}