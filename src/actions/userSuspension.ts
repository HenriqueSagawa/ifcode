"use server";

import { db } from "@/lib/firebase";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createNotification } from "@/actions/notifications";

type ModeratorRole = "moderator" | "admin" | "superadmin";

async function assertModeratorAdmin(): Promise<{ userId: string } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Usuário não autenticado" };
  const ref = doc(db, "users", session.user.id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { error: "Usuário não encontrado" };
  const role = (snap.data() as any).role as ModeratorRole | undefined;
  if (!role || (role !== "moderator" && role !== "admin" && role !== "superadmin")) {
    return { error: "Acesso negado. Apenas moderadores podem executar esta ação" };
  }
  return { userId: session.user.id };
}

export async function suspendUser(targetUserId: string, durationHours: number, reason?: string) {
  const auth = await assertModeratorAdmin();
  if ("error" in auth) return { success: false, message: auth.error };
  if (!targetUserId) return { success: false, message: "ID do usuário inválido" };
  
  const until = new Date(Date.now() + Math.max(1, durationHours) * 3600 * 1000).toISOString();
  await updateDoc(doc(db, "users", targetUserId), {
    suspendedUntil: until,
    suspensionReason: reason || "",
    updatedAt: new Date().toISOString(),
  });

  // Enviar notificação para o usuário suspenso
  try {
    await createNotification({
      userId: targetUserId,
      title: "⚠️ Conta Suspensa",
      message: `Sua conta foi suspensa por ${durationHours} horas. Motivo: ${reason || "Violação das regras da comunidade"}. Suspensão até: ${new Date(until).toLocaleString()}`,
      type: "warning",
      actionType: "system"
    });
  } catch (error) {
    console.error("Erro ao enviar notificação de suspensão:", error);
  }

  return { success: true, message: "Usuário suspenso" };
}

export async function unsuspendUser(targetUserId: string) {
  const auth = await assertModeratorAdmin();
  if ("error" in auth) return { success: false, message: auth.error };
  if (!targetUserId) return { success: false, message: "ID do usuário inválido" };
  
  await updateDoc(doc(db, "users", targetUserId), {
    suspendedUntil: null,
    suspensionReason: "",
    updatedAt: new Date().toISOString(),
  });

  // Enviar notificação de reativação
  try {
    await createNotification({
      userId: targetUserId,
      title: "✅ Conta Reativada",
      message: "Sua conta foi reativada e você já pode usar todas as funcionalidades novamente.",
      type: "success",
      actionType: "system"
    });
  } catch (error) {
    console.error("Erro ao enviar notificação de reativação:", error);
  }

  return { success: true, message: "Usuário reativado" };
}

export async function removeUserSuspension(targetUserId: string) {
  return unsuspendUser(targetUserId);
}


