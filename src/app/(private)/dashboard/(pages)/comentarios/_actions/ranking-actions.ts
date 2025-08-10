"use server"

import { db } from "@/lib/firebase"
import { collection, doc, getDoc, updateDoc, addDoc, increment } from "firebase/firestore"

// Interface para o registro de ranking
export interface RankingRecord {
  id?: string;
  userId: string; // ID do usuário que recebeu os pontos
  points: number; // Quantidade de pontos ganhos (sempre 25 para aprovação de comentário)
  reason: 'comment_approved' | 'post_liked' | 'other'; // Motivo dos pontos
  commentId?: string; // ID do comentário aprovado (se aplicável)
  grantedBy: string; // ID do usuário que concedeu os pontos
  createdAt: string; // Data quando os pontos foram concedidos
  metadata?: any; // Dados extras se necessário
}

// Interface para os pontos do usuário
export interface UserPoints {
  totalPoints: number;
  level: number;
  lastUpdated: string;
}

// Constantes do sistema de pontos
const POINTS_CONFIG = {
  COMMENT_APPROVED: 25,
  POST_LIKED: 5, // Para futuras implementações
  BONUS_ENGAGEMENT: 10 // Para futuras implementações
}

// Sistema de levels atualizado
const LEVEL_THRESHOLDS = {
  1: { min: 0, max: 99, name: "Aprendiz" },
  2: { min: 100, max: 249, name: "Estudante" },
  3: { min: 250, max: 499, name: "Programador Júnior" },
  4: { min: 500, max: 999, name: "Programador Pleno" },
  5: { min: 1000, max: 1999, name: "Programador Sênior" },
  6: { min: 2000, max: 3999, name: "Arquiteto de Software" },
  7: { min: 4000, max: Infinity, name: "Mestre do Código" }
}

/**
 * Adiciona pontos ao usuário quando seu comentário é aprovado
 */
export async function adicionarPontosComentarioAprovado(
  comentarioId: string,
  autorComentarioId: string, // Usuário que fez o comentário (recebe os pontos)
  autorPostId: string // Usuário que aprovou o comentário (concede os pontos)
): Promise<void> {
  try {
    const pontos = POINTS_CONFIG.COMMENT_APPROVED;
    const agora = new Date().toISOString();

    // 1. Criar registro na tabela ranking
    const rankingData: Omit<RankingRecord, 'id'> = {
      userId: autorComentarioId,
      points: pontos,
      reason: 'comment_approved',
      commentId: comentarioId,
      grantedBy: autorPostId,
      createdAt: agora,
      metadata: {
        action: 'comment_approval',
        description: `Comentário aprovado, +${pontos} pontos`
      }
    };

    // Adicionar registro na coleção ranking
    await addDoc(collection(db, "ranking"), rankingData);

    // 2. Atualizar pontos totais do usuário
    await atualizarPontosUsuario(autorComentarioId, pontos);

    console.log(`✅ ${pontos} pontos adicionados para o usuário ${autorComentarioId}`);
    
  } catch (error) {
    console.error("Erro ao adicionar pontos:", error);
    throw new Error("Falha ao conceder pontos pelo comentário aprovado");
  }
}

/**
 * Atualiza os pontos totais do usuário na tabela users
 */
export async function atualizarPontosUsuario(userId: string, pontosAdicionais: number): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error(`Usuário ${userId} não encontrado`);
    }

    const userData = userDoc.data();
    const pontosAtuais = userData.totalPoints || 0;
    const novosPontos = pontosAtuais + pontosAdicionais;
    
    // Calcular level com a nova escala
    const novoLevel = await calcularLevel(novosPontos);

    // Criar objeto de atualização com valores primitivos
    const updateData = {
      totalPoints: novosPontos,
      level: novoLevel,
      lastUpdated: new Date().toISOString()
    };

    // Atualizar documento do usuário
    await updateDoc(userRef, updateData);

    console.log(`✅ Pontos do usuário ${userId} atualizados: ${pontosAtuais} → ${novosPontos} (Level ${novoLevel})`);
    
  } catch (error) {
    console.error("Erro ao atualizar pontos do usuário:", error);
    throw new Error("Falha ao atualizar pontos do usuário");
  }
}

/**
 * Calcula o level baseado nos pontos totais
 */
export async function calcularLevel(pontos: number): Promise<number> {
  // Sistema de levels atualizado:
  // Level 1: 0-99 pontos (Aprendiz)
  // Level 2: 100-249 pontos (Estudante)
  // Level 3: 250-499 pontos (Programador Júnior)
  // Level 4: 500-999 pontos (Programador Pleno)
  // Level 5: 1000-1999 pontos (Programador Sênior)
  // Level 6: 2000-3999 pontos (Arquiteto de Software)
  // Level 7: 4000+ pontos (Mestre do Código)
  
  if (pontos >= 4000) return 7;
  if (pontos >= 2000) return 6;
  if (pontos >= 1000) return 5;
  if (pontos >= 500) return 4;
  if (pontos >= 250) return 3;
  if (pontos >= 100) return 2;
  return 1;
}

/**
 * Retorna informações sobre um level específico
 */
export async function obterInfoLevel(level: number): Promise<{ min: number; max: number; name: string }> {
  return LEVEL_THRESHOLDS[level as keyof typeof LEVEL_THRESHOLDS] || LEVEL_THRESHOLDS[1];
}

/**
 * Retorna o próximo level e quantos pontos faltam para alcançá-lo
 */
export async function obterProximoLevel(pontosAtuais: number): Promise<{ 
  levelAtual: number; 
  proximoLevel: number | null; 
  pontosFaltam: number | null;
  nomeAtual: string;
  nomeProximo: string | null;
}> {
  const levelAtual = await calcularLevel(pontosAtuais);
  const infoAtual = await obterInfoLevel(levelAtual);
  
  if (levelAtual >= 7) {
    return {
      levelAtual,
      proximoLevel: null,
      pontosFaltam: null,
      nomeAtual: infoAtual.name,
      nomeProximo: null
    };
  }
  
  const proximoLevel = levelAtual + 1;
  const infoProximo = await obterInfoLevel(proximoLevel);
  const pontosFaltam = infoProximo.min - pontosAtuais;
  
  return {
    levelAtual,
    proximoLevel,
    pontosFaltam,
    nomeAtual: infoAtual.name,
    nomeProximo: infoProximo.name
  };
}

/**
 * Calcula a porcentagem de progresso dentro do level atual
 */
export async function calcularProgressoLevel(pontos: number): Promise<number> {
  const level = await calcularLevel(pontos);
  const info = await obterInfoLevel(level);
  
  if (level >= 7) return 100; // Level máximo
  
  const pontosNoLevel = pontos - info.min;
  const pontosNecessarios = info.max - info.min + 1;
  
  return Math.min(100, (pontosNoLevel / pontosNecessarios) * 100);
}