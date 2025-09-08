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
  limit as fbLimit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { PostProps } from "@/types/posts";
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

export async function listPostsForModeration(params?: {
  status?: ("published" | "archived" | "deleted")[];
  userId?: string;
  limit?: number;
  lastId?: string;
}): Promise<{ success: boolean; message: string; posts?: PostProps[]; lastId?: string }> {
  const auth = await assertModerator();
  if ("error" in auth) return { success: false, message: auth.error };

  const postsCol = collection(db, "posts");

  const constraints: any[] = [orderBy("createdAt", "desc")];
  if (params?.userId) constraints.push(where("userId", "==", params.userId));
  // Firestore doesn't support array-contains-any on a single field equality like this; filter client-side if multiple statuses
  if (params?.limit) constraints.push(fbLimit(params.limit));

  const q = query(postsCol, ...constraints);
  const snap = await getDocs(q);

  let posts: PostProps[] = snap.docs.map((d) => {
    const data = d.data() as any;
    const createdAt = (data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now())).toISOString();
    const updatedAt = (data.updatedAt?.toDate?.() || new Date(data.updatedAt || createdAt)).toISOString();
    return {
      id: d.id,
      title: data.title || "",
      content: data.content || "",
      createdAt,
      updatedAt,
      type: data.type || "article",
      programmingLanguage: data.programmingLanguage || "",
      codeSnippet: data.codeSnippet || "",
      imagesUrls: data.imagesUrls || [],
      likes: data.likes || 0,
      userId: data.userId || data.id || "",
      status: (data.status as any) || "published",
    } as PostProps;
  });

  if (params?.status && params.status.length > 0) {
    const allowed = new Set(params.status);
    posts = posts.filter((p) => allowed.has(p.status));
  }

  const last = snap.docs[snap.docs.length - 1];
  return {
    success: true,
    message: "Posts carregados",
    posts,
    lastId: last?.id,
  };
}

export async function updatePostStatus(
  postId: string,
  status: "published" | "archived" | "deleted"
): Promise<{ success: boolean; message: string }> {
  const auth = await assertModerator();
  if ("error" in auth) return { success: false, message: auth.error };

  if (!postId) return { success: false, message: "ID do post inválido" };

  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) return { success: false, message: "Post não encontrado" };

  const postData = postSnap.data();
  const postAuthorId = postData.userId;

  await updateDoc(postRef, {
    status,
    updatedAt: new Date().toISOString(),
  });

  // Enviar notificação para o autor do post se foi deletado ou arquivado
  if (status === "deleted" || status === "archived") {
    try {
      const actionText = status === "deleted" ? "removido" : "arquivado";
      await createNotification({
        userId: postAuthorId,
        title: `📝 Post ${actionText}`,
        message: `Seu post "${postData.title || "Sem título"}" foi ${actionText} por um moderador.`,
        type: "warning",
        actionType: "system",
        postId: postId,
        postTitle: postData.title || "Post sem título"
      });
    } catch (error) {
      console.error("Erro ao enviar notificação de remoção de post:", error);
    }
  }

  return { success: true, message: "Status do post atualizado" };
}

export async function restorePost(
  postId: string
): Promise<{ success: boolean; message: string }> {
  const result = await updatePostStatus(postId, "published");
  
  // Se a restauração foi bem-sucedida, enviar notificação
  if (result.success) {
    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data();
        await createNotification({
          userId: postData.userId,
          title: "📝 Post Restaurado",
          message: `Seu post "${postData.title || "Sem título"}" foi restaurado e está visível novamente.`,
          type: "success",
          actionType: "system",
          postId: postId,
          postTitle: postData.title || "Post sem título"
        });
      }
    } catch (error) {
      console.error("Erro ao enviar notificação de restauração de post:", error);
    }
  }
  
  return result;
}


