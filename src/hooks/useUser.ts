import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConnection';
import { UserData } from '@/types/userData';

interface useUserOptions {
    initialFetch?: boolean;
}

export function useUser(options: useUserOptions = {}) {
    const { initialFetch = false } = options;
    const [ user, setUser ] = useState<UserData | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<Error | null>(null);

    const getUserById = useCallback(async (userId: string) => {
        if (!userId) {
            setError(new Error('ID do usuário não fornecido'));
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data() as Omit<UserData, 'id'>;
                const user = { id: userSnap.id, ...userData };
                setUser(user);
                return user;
            } else {
                setUser(null);
                return null;
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Erro ao buscar usuário');
            setError(error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [])

    const getUserByEmail = useCallback(async (email: string) => {
        if (!email) {
          setError(new Error('Email não fornecido'))
          return null
        }
    
        setLoading(true)
        setError(null)
    
        try {
          const usersRef = collection(db, 'users')
          const q = query(usersRef, where('email', '==', email))
          const querySnapshot = await getDocs(q)
    
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0]
            const userData = doc.data() as Omit<UserData, 'id'>
            const user = { id: doc.id, ...userData }
            setUser(user)
            return user
          } else {
            setUser(null)
            return null
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Erro ao buscar usuário')
          setError(error)
          return null
        } finally {
          setLoading(false)
        }
      }, [])

      const getUsers = useCallback(async (criteria?: { field: string; operator: '==' | '!=' | '>' | '<' | '>=' | '<='; value: any }[]) => {
        setLoading(true)
        setError(null)
    
        try {
          const usersRef = collection(db, 'users')
          
          let q = query(usersRef)
          if (criteria && criteria.length > 0) {
            q = query(
              usersRef,
              ...criteria.map(c => where(c.field, c.operator, c.value))
            )
          }
          
          const querySnapshot = await getDocs(q)
          
          if (!querySnapshot.empty) {
            return querySnapshot.docs.map(doc => {
              const userData = doc.data() as Omit<UserData, 'id'>
              return { id: doc.id, ...userData } as UserData
            })
          } else {
            return []
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Erro ao buscar usuários')
          setError(error)
          return []
        } finally {
          setLoading(false)
        }
      }, [])

      return {
        user,
        loading,
        error,
        getUserById,
        getUserByEmail,
        getUsers
      }
}