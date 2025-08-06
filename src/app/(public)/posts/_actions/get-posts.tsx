"use server"

import { db } from "@/lib/firebase" // Ajuste o caminho conforme sua configuração
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore"
import type { PostProps } from "@/types/posts" // Ajuste o caminho
import { User } from "../../../../../types/next-auth"

export interface PostWithAuthor extends PostProps {
  author: User
}

export async function getAllPostsWithAuthors(): Promise<PostWithAuthor[]> {
  try {
    // Buscar todos os posts ordenados por data de criação (mais recentes primeiro)
    const postsQuery = query(
      collection(db, "posts"), 
      orderBy("createdAt", "desc")
    )
    
    const postsSnapshot = await getDocs(postsQuery)
    
    if (postsSnapshot.empty) {
      return []
    }

    // Extrair dados dos posts com tipagem correta
    const posts: PostProps[] = postsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title || "",
        content: data.content || "",
        createdAt: data.createdAt || "",
        updatedAt: data.updatedAt || "",
        type: data.type || "artigo",
        programmingLanguage: data.programmingLanguage || "",
        codeSnippet: data.codeSnippet || "",
        imagesUrls: data.imagesUrls || [],
        likes: data.likes || 0,
        userId: data.userId || "",
        status: data.status || "published"
      } as PostProps
    })

    // Buscar informações dos autores
    const postsWithAuthors: PostWithAuthor[] = await Promise.all(
      posts.map(async (post) => {
        try {
          // Buscar dados do usuário/autor
          const userDocRef = doc(db, "users", post.userId)
          const userSnapshot = await getDoc(userDocRef)
          
          let author: User
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data()
            author = {
              id: userSnapshot.id,
              name: userData.name || "Usuário sem nome",
              email: userData.email || "",
              bio: userData.bio || undefined,
              birthDate: userData.birthDate || undefined,
              createdAt: userData.createdAt || undefined,
              github: userData.github || undefined,
              phone: userData.phone || undefined,
              image: userData.image || undefined,
              bannerImage: userData.bannerImage || undefined,
              fullData: userData.fullData || undefined,
              skills: userData.skills || undefined
            } as User
          } else {
            // Caso o usuário não seja encontrado, criar um autor padrão
            author = {
              id: post.userId,
              name: "Usuário não encontrado",
              email: ""
            } as User
          }

          return {
            ...post,
            author
          } as PostWithAuthor
        } catch (error) {
          console.error(`Erro ao buscar autor do post ${post.id}:`, error)
          
          // Em caso de erro, retornar autor padrão
          return {
            ...post,
            author: {
              id: post.userId,
              name: "Erro ao carregar autor",
              email: ""
            } as User
          } as PostWithAuthor
        }
      })
    )

    return postsWithAuthors
  } catch (error) {
    console.error("Erro ao buscar posts com autores:", error)
    throw new Error("Falha ao carregar posts")
  }
}

// Server action alternativa para buscar posts de um usuário específico
export async function getPostsByUserWithAuthor(userId: string): Promise<PostWithAuthor[]> {
  try {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    )
    
    const postsSnapshot = await getDocs(postsQuery)
    
    if (postsSnapshot.empty) {
      return []
    }

    // Filtrar posts do usuário específico com tipagem correta
    const userPosts: PostProps[] = postsSnapshot.docs
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title || "",
          content: data.content || "",
          createdAt: data.createdAt || "",
          updatedAt: data.updatedAt || "",
          type: data.type || "artigo",
          programmingLanguage: data.programmingLanguage || "",
          codeSnippet: data.codeSnippet || "",
          imagesUrls: data.imagesUrls || [],
          likes: data.likes || 0,
          userId: data.userId || "",
          status: data.status || "published"
        } as PostProps
      })
      .filter(post => post.userId === userId)

    // Buscar informações do autor (apenas uma vez já que todos os posts são do mesmo usuário)
    const userDocRef = doc(db, "users", userId)
    const userSnapshot = await getDoc(userDocRef)
    
    let author: User
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data()
      author = {
        id: userSnapshot.id,
        name: userData.name || "Usuário sem nome",
        email: userData.email || "",
        bio: userData.bio || undefined,
        birthDate: userData.birthDate || undefined,
        createdAt: userData.createdAt || undefined,
        github: userData.github || undefined,
        phone: userData.phone || undefined,
        image: userData.image || undefined,
        bannerImage: userData.bannerImage || undefined,
        fullData: userData.fullData || undefined,
        skills: userData.skills || undefined
      } as User
    } else {
      author = {
        id: userId,
        name: "Usuário não encontrado",
        email: ""
      } as User
    }

    // Mapear todos os posts com o mesmo autor
    const postsWithAuthor: PostWithAuthor[] = userPosts.map(post => ({
      ...post,
      author
    }))

    return postsWithAuthor
  } catch (error) {
    console.error("Erro ao buscar posts do usuário:", error)
    throw new Error("Falha ao carregar posts do usuário")
  }
}