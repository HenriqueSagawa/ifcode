"use server";

import { db } from "@/lib/firebase";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { commentStatus } from "@/types/posts";
import { createNotification } from "@/actions/notifications";

type ModeratorRole = "moderator" | "admin" | "superadmin";

async function assertModerator(): Promise<{ userId: string } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Usuário não autenticado" };
  const userRef = doc(db, "users", session.user.id);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return { error: "Usuário não encontrado" };
  const role = (userSnap.data() as any).role as ModeratorRole | undefined;
  if (!role || (role !== "moderator" && role !== "admin" && role !== "superadmin")) {
    return { error: "Acesso negado. Apenas moderadores podem executar esta ação" };
  }
  return { userId: session.user.id };
}

export interface ModerationComment {
  id: string;
  postId: string;
  content: string;
  userId: string;
  createdAt: string;
  status: commentStatus;
}

export async function listCommentsForModeration(params?: {
  status?: commentStatus[];
  postId?: string;
  userId?: string;
}): Promise<{ success: boolean; message: string; comments?: ModerationComment[] }> {
  const auth = await assertModerator();
  if ("error" in auth) return { success: false, message: auth.error };

  const constraints: any[] = [orderBy("createdAt", "desc")];
  if (params?.postId) constraints.push(where("postId", "==", params.postId));
  if (params?.userId) constraints.push(where("userId", "==", params.userId));

  const q = query(collection(db, "comments"), ...constraints);
  const snap = await getDocs(q);
  let comments: ModerationComment[] = snap.docs.map((d) => {
    const data = d.data() as any;
    const createdAt = (data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now())).toISOString();
    return {
      id: d.id,
      postId: data.postId,
      content: data.content || "",
      userId: data.userId || "",
      createdAt,
      status: (data.status as commentStatus) || "pending",
    };
  });

  if (params?.status && params.status.length > 0) {
    const allowed = new Set(params.status);
    comments = comments.filter((c) => allowed.has(c.status));
  }

  return { success: true, message: "Comentários carregados", comments };
}

export async function updateCommentStatus(
  commentId: string,
  status: commentStatus
): Promise<{ success: boolean; message: string }> {
  const auth = await assertModerator();
  if ("error" in auth) return { success: false, message: auth.error };

  if (!commentId) return { success: false, message: "ID do comentário inválido" };

  const ref = doc(db, "comments", commentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { success: false, message: "Comentário não encontrado" };

  const commentData = snap.data();
  const commentAuthorId = commentData.userId;

  await updateDoc(ref, { status, updatedAt: new Date().toISOString() });

  // Enviar notificação para o autor do comentário
  try {
    let title = "";
    let message = "";
    let type: "info" | "success" | "warning" | "error" = "info";

    switch (status) {
      case "accepted":
        title = "💬 Comentário Aprovado";
        message = "Seu comentário foi aprovado e está visível para todos.";
        type = "success";
        break;
      case "rejected":
        title = "💬 Comentário Rejeitado";
        message = "Seu comentário foi rejeitado por não seguir as diretrizes da comunidade.";
        type = "warning";
        break;
      case "pending":
        title = "💬 Comentário em Análise";
        message = "Seu comentário está sendo analisado pelos moderadores.";
        type = "info";
        break;
    }

    await createNotification({
      userId: commentAuthorId,
      title,
      message,
      type,
      actionType: "system",
      postId: commentData.postId
    });
  } catch (error) {
    console.error("Erro ao enviar notificação de status do comentário:", error);
  }

  return { success: true, message: "Status do comentário atualizado" };
}


