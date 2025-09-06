"use server";

import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  startAfter,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { Report, ReportWithDetails, ReportStats, ReportFilters, ReportReason, ReportStatus, ReportableContentType } from "@/types/reports";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  notifyReportApproved, 
  notifyReportRejected, 
  notifyContentRemoved 
} from "@/services/moderationNotifications";

// Criar uma nova denúncia
export async function createReport(
  contentId: string,
  contentType: ReportableContentType,
  reason: ReportReason,
  description?: string
): Promise<{ success: boolean; message: string; reportId?: string }> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, message: "Usuário não autenticado" };
    }

    // Verificar se o usuário já denunciou este conteúdo
    const existingReportQuery = query(
      collection(db, "reports"),
      where("contentId", "==", contentId),
      where("reporterId", "==", session.user.id),
      where("status", "==", "pending")
    );
    
    const existingReports = await getDocs(existingReportQuery);
    if (!existingReports.empty) {
      return { success: false, message: "Você já denunciou este conteúdo" };
    }

    // Verificar se o conteúdo existe
    const contentRef = contentType === "post" 
      ? doc(db, "posts", contentId)
      : doc(db, "comments", contentId);
    
    const contentDoc = await getDoc(contentRef);
    if (!contentDoc.exists()) {
      return { success: false, message: "Conteúdo não encontrado" };
    }

    // Criar a denúncia
    const reportData: Omit<Report, "id"> = {
      contentId,
      contentType,
      reporterId: session.user.id,
      reason,
      description: description || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "reports"), reportData);

    return { 
      success: true, 
      message: "Denúncia enviada com sucesso", 
      reportId: docRef.id 
    };
  } catch (error) {
    console.error("Erro ao criar denúncia:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
}

// Buscar denúncias com filtros (para moderadores)
export async function getReports(
  filters: ReportFilters = {},
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot
): Promise<{ reports: ReportWithDetails[]; hasMore: boolean; lastDoc?: QueryDocumentSnapshot }> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se o usuário é moderador, admin ou superadmin
    const userDoc = await getDoc(doc(db, "users", session.user.id));
    const userData = userDoc.data();
    
    if (!userData || (userData.role !== "moderator" && userData.role !== "admin" && userData.role !== "superadmin")) {
      throw new Error("Acesso negado. Apenas moderadores podem visualizar denúncias");
    }

    let q = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc")
    );

    // Aplicar filtros
    if (filters.status && filters.status.length > 0) {
      q = query(q, where("status", "in", filters.status));
    }
    
    if (filters.reason && filters.reason.length > 0) {
      q = query(q, where("reason", "in", filters.reason));
    }
    
    if (filters.contentType && filters.contentType.length > 0) {
      q = query(q, where("contentType", "in", filters.contentType));
    }

    if (filters.dateFrom) {
      q = query(q, where("createdAt", ">=", filters.dateFrom));
    }
    
    if (filters.dateTo) {
      q = query(q, where("createdAt", "<=", filters.dateTo));
    }

    if (filters.moderatorId) {
      q = query(q, where("moderatorId", "==", filters.moderatorId));
    }

    // Paginação
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    q = query(q, limit(pageSize + 1));

    const snapshot = await getDocs(q);
    const reports: ReportWithDetails[] = [];

    for (const reportDoc of snapshot.docs.slice(0, pageSize)) {
      const reportData = reportDoc.data() as Report;
      
      // Buscar dados do conteúdo denunciado
      const contentRef = reportData.contentType === "post" 
        ? doc(db, "posts", reportData.contentId)
        : doc(db, "comments", reportData.contentId);
      
      const contentDoc = await getDoc(contentRef);
      if (!contentDoc.exists()) continue;

      const contentData = contentDoc.data();
      
      // Buscar dados do autor do conteúdo
      const authorDoc = await getDoc(doc(db, "users", contentData.userId));
      const authorData = authorDoc.data();

      // Buscar dados do denunciante
      const reporterDoc = await getDoc(doc(db, "users", reportData.reporterId));
      const reporterData = reporterDoc.data();

      // Buscar dados do moderador (se houver)
      let moderatorData = null;
      if (reportData.moderatorId) {
        const moderatorDoc = await getDoc(doc(db, "users", reportData.moderatorId));
        moderatorData = moderatorDoc.data();
      }

      reports.push({
        ...reportData,
        id: reportDoc.id,
        content: {
          id: reportData.contentId,
          title: contentData.title || "",
          content: contentData.content,
          authorId: contentData.userId,
          authorName: authorData?.name || "Usuário desconhecido",
          authorImage: authorData?.image,
          createdAt: contentData.createdAt?.toDate?.()?.toISOString() || contentData.createdAt
        },
        reporter: {
          id: reportData.reporterId,
          name: reporterData?.name || "Usuário desconhecido",
          email: reporterData?.email || "",
          image: reporterData?.image
        },
        moderator: moderatorData ? {
          id: reportData.moderatorId!,
          name: moderatorData.name,
          email: moderatorData.email
        } : undefined
      });
    }

    const hasMore = snapshot.docs.length > pageSize;
    const newLastDoc = hasMore ? snapshot.docs[pageSize - 1] : undefined;

    return { reports, hasMore, lastDoc: newLastDoc };
  } catch (error) {
    console.error("Erro ao buscar denúncias:", error);
    throw error;
  }
}

// Atualizar status de uma denúncia
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  moderatorNotes?: string,
  actionTaken?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, message: "Usuário não autenticado" };
    }

    // Verificar se o usuário é moderador, admin ou superadmin
    const userDoc = await getDoc(doc(db, "users", session.user.id));
    const userData = userDoc.data();
    
    if (!userData || (userData.role !== "moderator" && userData.role !== "admin" && userData.role !== "superadmin")) {
      return { success: false, message: "Acesso negado. Apenas moderadores podem moderar denúncias" };
    }

    // Buscar a denúncia
    const reportDoc = await getDoc(doc(db, "reports", reportId));
    if (!reportDoc.exists()) {
      return { success: false, message: "Denúncia não encontrada" };
    }

    const reportData = reportDoc.data() as Report;

    // Atualizar a denúncia
    await updateDoc(doc(db, "reports", reportId), {
      status,
      moderatorId: session.user.id,
      moderatorNotes: moderatorNotes || "",
      actionTaken: actionTaken || "",
      updatedAt: new Date().toISOString()
    });

    // Se a denúncia foi aprovada, aplicar ação no conteúdo
    if (status === "approved") {
      const contentRef = reportData.contentType === "post" 
        ? doc(db, "posts", reportData.contentId)
        : doc(db, "comments", reportData.contentId);
      
      if (actionTaken === "remove") {
        await updateDoc(contentRef, {
          status: "deleted",
          updatedAt: new Date().toISOString()
        });
      } else if (actionTaken === "hide") {
        await updateDoc(contentRef, {
          status: "archived",
          updatedAt: new Date().toISOString()
        });
      } else {
        // Se não especificou ação, mas aprovou a denúncia, remover o conteúdo
        await updateDoc(contentRef, {
          status: "deleted",
          updatedAt: new Date().toISOString()
        });
      }

      // Notificar o denunciante
      try {
        await notifyReportApproved(
          reportData.reporterId,
          reportId,
          reportData.contentId,
          reportData.contentType,
          session.user.name || "Moderador",
          reportData.reason
        );
      } catch (error) {
        console.error("Erro ao enviar notificação de aprovação:", error);
      }

      // Notificar o autor do conteúdo (se não for o mesmo que denunciou)
      if (reportData.reporterId !== reportData.contentId) {
        try {
          const contentDoc = await getDoc(contentRef);
          if (contentDoc.exists()) {
            const contentData = contentDoc.data();
            await notifyContentRemoved(
              contentData.userId,
              reportData.contentId,
              reportData.contentType,
              session.user.name || "Moderador",
              reportData.reason
            );
          }
        } catch (error) {
          console.error("Erro ao enviar notificação de remoção:", error);
        }
      }
    } else if (status === "rejected") {
      // Notificar o denunciante sobre a rejeição
      try {
        await notifyReportRejected(
          reportData.reporterId,
          reportId,
          session.user.name || "Moderador",
          moderatorNotes
        );
      } catch (error) {
        console.error("Erro ao enviar notificação de rejeição:", error);
      }
    }

    return { success: true, message: "Status da denúncia atualizado com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar status da denúncia:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
}

// Buscar estatísticas de denúncias
export async function getReportStats(): Promise<ReportStats> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se o usuário é moderador, admin ou superadmin
    const userDoc = await getDoc(doc(db, "users", session.user.id));
    const userData = userDoc.data();
    
    if (!userData || (userData.role !== "moderator" && userData.role !== "admin" && userData.role !== "superadmin")) {
      throw new Error("Acesso negado. Apenas moderadores podem visualizar estatísticas");
    }

    const reportsSnapshot = await getDocs(collection(db, "reports"));
    
    const stats: ReportStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      resolved: 0,
      byReason: {
        spam: 0,
        offensive_language: 0,
        harassment: 0,
        inappropriate_content: 0,
        misinformation: 0,
        copyright_violation: 0,
        other: 0
      },
      byContentType: {
        post: 0,
        comment: 0
      }
    };

    reportsSnapshot.forEach((doc) => {
      const data = doc.data() as Report;
      stats.total++;
      stats[data.status]++;
      stats.byReason[data.reason]++;
      stats.byContentType[data.contentType]++;
    });

    return stats;
  } catch (error) {
    console.error("Erro ao buscar estatísticas de denúncias:", error);
    throw error;
  }
}

// Verificar se o usuário pode moderar
export async function canUserModerate(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return false;
    }

    const userDoc = await getDoc(doc(db, "users", session.user.id));
    const userData = userDoc.data();
    
    return userData?.role === "moderator" || userData?.role === "admin" || userData?.role === "superadmin";
  } catch (error) {
    console.error("Erro ao verificar permissões de moderação:", error);
    return false;
  }
}

// Verificar se o usuário já denunciou um conteúdo
export async function hasUserReportedContent(contentId: string): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return false;
    }

    const existingReportQuery = query(
      collection(db, "reports"),
      where("contentId", "==", contentId),
      where("reporterId", "==", session.user.id),
      where("status", "==", "pending")
    );
    
    const existingReports = await getDocs(existingReportQuery);
    return !existingReports.empty;
  } catch (error) {
    console.error("Erro ao verificar se usuário já denunciou:", error);
    return false;
  }
}
