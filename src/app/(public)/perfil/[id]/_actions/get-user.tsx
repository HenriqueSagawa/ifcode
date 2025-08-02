import { db } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin';
import { doc, getDoc } from 'firebase/firestore';

export async function getUserById(userId: string) {
    try {
         const userRef = doc(db, 'users', userId);
         const userDoc = await getDoc(userRef);

         if (!userDoc.exists()) {
            return { error: 'Usuário não encontrado' };
         }

         const userData = userDoc.data();

        return {
            success: true,
            user: {
                id: userDoc.id,
                ...userData
            }
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return { error: 'Erro ao buscar usuário' };
    }
}