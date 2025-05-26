import { useState, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy, 
  Timestamp, 
  serverTimestamp, 
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';

export interface CommentData {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorImage?: string | null;
  content: string;
  createdAt: Timestamp;
}

interface NewCommentData {
  postId: string;
  userId: string;
  authorName: string;
  authorImage?: string | null;
  content: string;
}

interface UseCommentOptions {
  defaultSorting?: { field: string; direction: 'asc' | 'desc' };
}

export function useComment(options: UseCommentOptions = {}) {
  const { 
    defaultSorting = { field: 'createdAt', direction: 'asc' } 
  } = options;

  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCommentsByPostId = useCallback(async (postId: string) => {
    if (!postId) {
      setError(new Error('ID do post não fornecido'));
      return [];
    }

    setLoading(true);
    setError(null);
    setComments([]);

    try {
      const commentsRef = collection(db, 'comments');

      
      const q = query(
        commentsRef, 
        where('postId', '==', postId),
        orderBy(defaultSorting.field, defaultSorting.direction)
      );
      
      const querySnapshot = await getDocs(q);
      
      const fetchedComments = querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<CommentData, 'id'>;
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(); 
        return { id: doc.id, ...data, createdAt } as CommentData;
      });

      setComments(fetchedComments);
      return fetchedComments;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao buscar comentários por post');
      setError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [defaultSorting]);

  const getCommentsByUserId = useCallback(async (userId: string) => {
    if (!userId) {
      setError(new Error('ID do usuário não fornecido'));
      return [];
    }

    setLoading(true);
    setError(null);
    setComments([]);

    try {
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc') 
      );
      
      const querySnapshot = await getDocs(q);
      
      const fetchedComments = querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<CommentData, 'id'>;
         // Certifica que createdAt é um Timestamp do Firebase
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now();
        return { id: doc.id, ...data, createdAt } as CommentData;
      });

      setComments(fetchedComments);
      return fetchedComments;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao buscar comentários por usuário');
      setError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adiciona um novo comentário ao Firestore.
   */
  const addComment = useCallback(async (commentData: NewCommentData) => {
    if (!commentData.postId || !commentData.userId || !commentData.content) {
      setError(new Error('Dados incompletos para adicionar comentário'));
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const commentsRef = collection(db, 'comments');
      const newComment = {
        ...commentData,
        createdAt: serverTimestamp() // Usa o timestamp do servidor
      };
      
      const docRef = await addDoc(commentsRef, newComment);
      
      // Retorna o comentário adicionado com ID e timestamp resolvido (aproximado)
      const addedComment: CommentData = {
        id: docRef.id,
        ...commentData,
        createdAt: Timestamp.now() // Timestamp local como aproximação
      };

      return addedComment;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao adicionar comentário');
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    comments,
    loading,
    error,
    getCommentsByPostId,
    getCommentsByUserId,
    addComment
  };
}

