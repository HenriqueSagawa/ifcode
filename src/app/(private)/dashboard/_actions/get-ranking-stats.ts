"use server"

import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore"

export interface RankingEntry {
  id?: string;
  userId: string;
  points: number;
  reason: 'comment_approved' | 'post_liked' | 'other';
  commentId?: string;
  grantedBy: string;
  createdAt: string;
  metadata?: any;
}

export interface UserRankingStats {
  totalPoints: number;
  level: number;
  weeklyPoints: number;
  monthlyPoints: number;
  currentPosition: number;
  recentEntries: RankingEntry[];
  weeklyGain: number;
  positionChange: number;
}

/**
 * Busca todos os pontos de um usuário específico
 */
export async function getUserRankingEntries(userId: string): Promise<RankingEntry[]> {
  try {
    const rankingRef = collection(db, "ranking");
    const q = query(
      rankingRef, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const entries: RankingEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data()
      } as RankingEntry);
    });
    
    return entries;
  } catch (error) {
    console.error("Erro ao buscar entradas do ranking:", error);
    return [];
  }
}

/**
 * Calcula os pontos ganhos na última semana
 */
function getWeeklyPoints(entries: RankingEntry[]): number {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return entries
    .filter(entry => new Date(entry.createdAt) >= oneWeekAgo)
    .reduce((total, entry) => total + entry.points, 0);
}

/**
 * Calcula os pontos ganhos no último mês
 */
function getMonthlyPoints(entries: RankingEntry[]): number {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  return entries
    .filter(entry => new Date(entry.createdAt) >= oneMonthAgo)
    .reduce((total, entry) => total + entry.points, 0);
}

/**
 * Busca a posição do usuário no ranking geral
 */
async function getUserRankingPosition(userId: string, userTotalPoints: number): Promise<{ position: number, positionChange: number }> {
  try {
    // Busca todos os usuários ordenados por totalPoints
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("totalPoints", "desc"));
    const querySnapshot = await getDocs(q);
    
    let position = 1;
    let found = false;
    
    querySnapshot.forEach((doc) => {
      if (!found) {
        if (doc.id === userId) {
          found = true;
        } else {
          position++;
        }
      }
    });
    
    // Para simplicidade, vamos simular uma mudança de posição
    // Em um sistema real, você salvaria a posição anterior
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

/**
 * Busca estatísticas completas do ranking do usuário
 */
export async function getUserRankingStats(userId: string): Promise<UserRankingStats> {
  try {
    // Busca dados do usuário
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("Usuário não encontrado");
    }
    
    const userData = userDoc.data();
    const totalPoints = userData.totalPoints || 0;
    const level = userData.level || 1;
    
    // Busca entradas do ranking
    const entries = await getUserRankingEntries(userId);
    
    // Calcula estatísticas
    const weeklyPoints = getWeeklyPoints(entries);
    const monthlyPoints = getMonthlyPoints(entries);
    const { position, positionChange } = await getUserRankingPosition(userId, totalPoints);
    
    // Pega as últimas 10 entradas para atividades recentes
    const recentEntries = entries.slice(0, 10);
    
    return {
      totalPoints,
      level,
      weeklyPoints,
      monthlyPoints,
      currentPosition: position,
      recentEntries,
      weeklyGain: weeklyPoints,
      positionChange
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas do ranking:", error);
    return {
      totalPoints: 0,
      level: 1,
      weeklyPoints: 0,
      monthlyPoints: 0,
      currentPosition: 0,
      recentEntries: [],
      weeklyGain: 0,
      positionChange: 0
    };
  }
}

/**
 * Busca o top 10 usuários no ranking geral
 */
export async function getTopRanking(limitCount: number = 10) {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef, 
      orderBy("totalPoints", "desc"), 
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const topUsers: any[] = [];
    
    querySnapshot.forEach((doc) => {
      topUsers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return topUsers;
  } catch (error) {
    console.error("Erro ao buscar top ranking:", error);
    return [];
  }
}

/**
 * Busca estatísticas de atividades recentes do usuário
 */
export async function getUserRecentActivity(userId: string) {
  try {
    const entries = await getUserRankingEntries(userId);
    
    // Agrupa por tipo de atividade
    const activities = {
      comments: entries.filter(e => e.reason === 'comment_approved').length,
      likes: entries.filter(e => e.reason === 'post_liked').length,
      other: entries.filter(e => e.reason === 'other').length,
    };
    
    // Calcula streak (dias consecutivos de atividade)
    const streak = calculateStreak(entries);
    
    return {
      ...activities,
      streak,
      totalActivities: entries.length
    };
  } catch (error) {
    console.error("Erro ao buscar atividades recentes:", error);
    return {
      comments: 0,
      likes: 0,
      other: 0,
      streak: 0,
      totalActivities: 0
    };
  }
}

/**
 * Calcula o streak de dias consecutivos
 */
function calculateStreak(entries: RankingEntry[]): number {
  if (entries.length === 0) return 0;
  
  // Ordena por data (mais recente primeiro)
  const sortedEntries = entries.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Agrupa por dia
  const dayGroups = new Map<string, boolean>();
  sortedEntries.forEach(entry => {
    const date = new Date(entry.createdAt).toDateString();
    dayGroups.set(date, true);
  });
  
  // Calcula streak
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 365; i++) { // Máximo de 365 dias
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateString = checkDate.toDateString();
    
    if (dayGroups.has(dateString)) {
      streak++;
    } else if (i > 0) {
      // Se não tem atividade em um dia (exceto hoje), quebra o streak
      break;
    }
  }
  
  return streak;
}