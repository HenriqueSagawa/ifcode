import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export interface ModerationNotification {
  id?: string;
  userId: string;
  type: "report_approved" | "report_rejected" | "content_removed" | "content_restored" | "user_warned" | "user_banned";
  title: string;
  message: string;
  data?: {
    reportId?: string;
    contentId?: string;
    contentType?: "post" | "comment";
    moderatorId?: string;
    moderatorName?: string;
    reason?: string;
  };
  read: boolean;
  createdAt: string;
}

export async function createModerationNotification(
  notification: Omit<ModerationNotification, "id" | "read" | "createdAt">
): Promise<{ success: boolean; message: string; notificationId?: string }> {
  try {
    const notificationData: Omit<ModerationNotification, "id"> = {
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "notification"), notificationData);

    return {
      success: true,
      message: "Notificação criada com sucesso",
      notificationId: docRef.id
    };
  } catch (error) {
    console.error("Erro ao criar notificação de moderação:", error);
    return {
      success: false,
      message: "Erro interno do servidor"
    };
  }
}

export async function notifyReportApproved(
  reporterId: string,
  reportId: string,
  contentId: string,
  contentType: "post" | "comment",
  moderatorName: string,
  reason: string
): Promise<void> {
  await createModerationNotification({
    userId: reporterId,
    type: "report_approved",
    title: "Denúncia Aprovada",
    message: `Sua denúncia foi aprovada por ${moderatorName}. O conteúdo foi removido devido a: ${reason}`,
    data: {
      reportId,
      contentId,
      contentType,
      reason
    }
  });
}

export async function notifyReportRejected(
  reporterId: string,
  reportId: string,
  moderatorName: string,
  reason?: string
): Promise<void> {
  await createModerationNotification({
    userId: reporterId,
    type: "report_rejected",
    title: "Denúncia Rejeitada",
    message: `Sua denúncia foi rejeitada por ${moderatorName}. ${reason ? `Motivo: ${reason}` : ""}`,
    data: {
      reportId,
      reason
    }
  });
}

export async function notifyContentRemoved(
  authorId: string,
  contentId: string,
  contentType: "post" | "comment",
  moderatorName: string,
  reason: string
): Promise<void> {
  await createModerationNotification({
    userId: authorId,
    type: "content_removed",
    title: "Conteúdo Removido",
    message: `Seu ${contentType === "post" ? "post" : "comentário"} foi removido por ${moderatorName}. Motivo: ${reason}`,
    data: {
      contentId,
      contentType,
      reason
    }
  });
}

export async function notifyUserWarned(
  userId: string,
  moderatorName: string,
  reason: string
): Promise<void> {
  await createModerationNotification({
    userId,
    type: "user_warned",
    title: "Aviso de Moderação",
    message: `Você recebeu um aviso de ${moderatorName}. Motivo: ${reason}`,
    data: {
      reason
    }
  });
}

export async function notifyUserBanned(
  userId: string,
  moderatorName: string,
  reason: string,
  duration?: string
): Promise<void> {
  await createModerationNotification({
    userId,
    type: "user_banned",
    title: "Conta Suspensa",
    message: `Sua conta foi suspensa por ${moderatorName}. ${duration ? `Duração: ${duration}` : "Permanente"}. Motivo: ${reason}`,
    data: {
      reason
    }
  });
}
