'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  orderBy, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/services/firebaseConnection';

import { PostsProps } from '@/types/posts'

export type PostFilter = {
  field: string
  operator: '==' | '!=' | '>' | '<' | '>=' | '<='
  value: any
}

export type PostSorting = {
  field: string
  direction: 'asc' | 'desc'
}

interface UsePostsOptions {
  initialFetch?: boolean
  defaultLimit?: number
  defaultSorting?: PostSorting
}

/**
 * Hook para buscar e filtrar posts do Firestore
 */
export function usePosts(options: UsePostsOptions = {}) {
  const { 
    initialFetch = false, 
    defaultLimit = 10,
    defaultSorting = { field: 'createdAt', direction: 'desc' }
  } = options
  
  const [posts, setPosts] = useState<PostsProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [hasMore, setHasMore] = useState(true)

  /**
   * Busca um post pelo ID do documento
   */
  const getPostById = useCallback(async (postId: string) => {
    if (!postId) {
      setError(new Error('ID do post não fornecido'))
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const postRef = doc(db, 'posts', postId)
      const postSnap = await getDoc(postRef)

      if (postSnap.exists()) {
        const postData = postSnap.data() as Omit<PostsProps, 'id'>
        return { id: postSnap.id, ...postData } as PostsProps
      } else {
        return null
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao buscar post')
      setError(error)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Busca posts com filtros, ordenação e paginação
   */
  const getPosts = useCallback(async ({
    filters = [],
    sorting = defaultSorting,
    pageSize = defaultLimit,
    resetPagination = false
  }: {
    filters?: PostFilter[]
    sorting?: PostSorting
    pageSize?: number
    resetPagination?: boolean
  } = {}) => {
    setLoading(true)
    setError(null)

    try {
      const postsRef = collection(db, 'posts')
      
      let queryConstraints = []
      
      if (filters && filters.length > 0) {
        queryConstraints.push(...filters.map(f => where(f.field, f.operator, f.value)))
      }
      
      if (sorting) {
        queryConstraints.push(orderBy(sorting.field, sorting.direction))
      }
      
      queryConstraints.push(limit(pageSize))
      
      if (lastVisible && !resetPagination) {
        queryConstraints.push(startAfter(lastVisible))
      }
      
      const q = query(postsRef, ...queryConstraints)
      const querySnapshot = await getDocs(q)
      
      const newPosts = querySnapshot.docs.map(doc => {
        const postData = doc.data() as Omit<PostsProps, 'id'>
        return { id: doc.id, ...postData } as PostsProps
      })
      
      if (resetPagination) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }
      
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
      setLastVisible(lastDoc || null)
      

      setHasMore(querySnapshot.docs.length === pageSize)
      
      return newPosts
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao buscar posts')
      setError(error)
      return []
    } finally {
      setLoading(false)
    }
  }, [defaultLimit, defaultSorting, lastVisible])

  const getPostsByTags = useCallback(async (tags: string[], options = {}) => {
    if (!tags || tags.length === 0) {
      setError(new Error('Tags não fornecidas'))
      return []
    }

    const filters: PostFilter[] = [
      { field: 'tags', operator: '==', value: tags[0] }
    ]

    return getPosts({ 
      filters, 
      resetPagination: true,
      ...options 
    })
  }, [getPosts])

  const getPostsByAuthor = useCallback(async (authorId: string, options = {}) => {
    if (!authorId) {
      setError(new Error('ID do autor não fornecido'))
      return []
    }

    const filters: PostFilter[] = [
      { field: 'authorId', operator: '==', value: authorId }
    ]

    return getPosts({ 
      filters, 
      resetPagination: true,
      ...options 
    })
  }, [getPosts])

  const loadMorePosts = useCallback(async (options = {}) => {
    if (!hasMore) return []
    
    return getPosts({
      resetPagination: false,
      ...options
    })
  }, [getPosts, hasMore])

  const refreshPosts = useCallback(async (options = {}) => {
    setLastVisible(null)
    setHasMore(true)
    
    return getPosts({
      resetPagination: true,
      ...options
    })
  }, [getPosts])

  useEffect(() => {
    if (initialFetch) {
      refreshPosts()
    }
  }, [initialFetch, refreshPosts])

  return {
    posts,
    loading,
    error,
    hasMore,
    getPostById,
    getPosts,
    getPostsByTags,
    getPostsByAuthor,
    loadMorePosts,
    refreshPosts
  }
}
