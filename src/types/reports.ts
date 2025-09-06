export type ReportReason = 
  | "spam" 
  | "offensive_language" 
  | "harassment" 
  | "inappropriate_content" 
  | "misinformation" 
  | "copyright_violation" 
  | "other";

export type ReportStatus = 
  | "pending" 
  | "approved" 
  | "rejected" 
  | "resolved";

export type ReportableContentType = 
  | "post" 
  | "comment";

export interface Report {
  id: string;
  contentId: string; // ID do post ou comentário denunciado
  contentType: ReportableContentType;
  reporterId: string; // ID do usuário que denunciou
  reason: ReportReason;
  description?: string; // Descrição adicional opcional
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  moderatorId?: string; // ID do moderador que analisou
  moderatorNotes?: string; // Notas internas do moderador
  actionTaken?: string; // Ação tomada (remover, banir, etc.)
}

export interface ReportWithDetails extends Report {
  content: {
    id: string;
    title?: string; // Para posts
    content: string;
    authorId: string;
    authorName: string;
    authorImage?: string;
    createdAt: string;
  };
  reporter: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  moderator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ReportStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  resolved: number;
  byReason: Record<ReportReason, number>;
  byContentType: Record<ReportableContentType, number>;
}

export interface UserRole {
  id: string;
  userId: string;
  role: "user" | "moderator" | "admin";
  assignedAt: string;
  assignedBy: string;
}

export interface ReportFilters {
  status?: ReportStatus[];
  reason?: ReportReason[];
  contentType?: ReportableContentType[];
  dateFrom?: string;
  dateTo?: string;
  moderatorId?: string;
}
