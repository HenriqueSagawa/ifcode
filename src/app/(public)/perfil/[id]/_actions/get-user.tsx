import { db } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';

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

export async function getUserRankingPosition(userId: string, userTotalPoints: number): Promise<{ position: number, positionChange: number }> {
    try {
      // 1. Busca todos os usuários ordenados por totalPoints (decrescente)
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("totalPoints", "desc"));
      const querySnapshot = await getDocs(q);
  
      let position = 1;
      let found = false;
  
      // 2. Percorre os usuários em ordem e conta até encontrar o usuário atual
      querySnapshot.forEach((doc) => {
        if (!found) {
          if (doc.id === userId) {
            found = true; // Encontrou o usuário na posição atual
          } else {
            position++; // Incrementa posição para cada usuário com mais pontos
          }
        }
      });
  
      // 3. Simula mudança de posição (não é ideal)
      const positionChange = Math.floor(Math.random() * 11) - 5; // -5 a +5
  
      return { 
        position: found ? position : 0,
        positionChange 
      };
    } catch (error) {
      console.error("Erro ao buscar posição no ranking:", error);
      return { position: 0, positionChange: 0 };
    }
  }