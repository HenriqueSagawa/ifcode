"use client";

import { useState } from "react";
import { ReportWithDetails, ReportStatus } from "@/types/reports";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  Flag,
  MessageSquare,
  FileText
} from "lucide-react";

interface ReportDetailsModalProps {
  report: ReportWithDetails;
  onClose: () => void;
  onStatusChange: (reportId: string, status: ReportStatus, actionTaken?: string) => void;
}

export function ReportDetailsModal({ report, onClose, onStatusChange }: ReportDetailsModalProps) {
  const [moderatorNotes, setModeratorNotes] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "approved":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "resolved":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getReasonLabel = (reason: string) => {
    return reason.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleStatusUpdate = async (status: ReportStatus) => {
    setIsProcessing(true);
    try {
      await onStatusChange(report.id, status, actionTaken || undefined);
    } finally {
      setIsProcessing(false);
    }
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-full">
              <Flag className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <DialogTitle>Detalhes da Denúncia</DialogTitle>
              <DialogDescription>
                Analise o conteúdo denunciado e tome a ação apropriada
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Denúncia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(report.status)}>
                  {report.status === "pending" && "Pendente"}
                  {report.status === "approved" && "Aprovada"}
                  {report.status === "rejected" && "Rejeitada"}
                  {report.status === "resolved" && "Resolvida"}
                </Badge>
                <Badge variant="outline">
                  {report.contentType === "post" ? "Post" : "Comentário"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Flag className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Motivo:</span>
                  <span>{getReasonLabel(report.reason)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Data:</span>
                  <span>{new Date(report.createdAt).toLocaleString("pt-BR")}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={report.reporter.image} />
                  <AvatarFallback className="text-xs">
                    {getAuthorInitials(report.reporter.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Denunciado por</p>
                  <p className="text-xs text-muted-foreground">{report.reporter.name}</p>
                </div>
              </div>
              
              {report.description && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Descrição adicional:</p>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo Denunciado */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {report.contentType === "post" ? (
                <FileText className="w-5 h-5 text-blue-500" />
              ) : (
                <MessageSquare className="w-5 h-5 text-green-500" />
              )}
              <h3 className="text-lg font-semibold">
                {report.contentType === "post" ? "Post Denunciado" : "Comentário Denunciado"}
              </h3>
            </div>
            
            <div className="border border-gray-700 rounded-lg p-4 bg-muted/30">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={report.content.authorImage} />
                  <AvatarFallback className="text-xs">
                    {getAuthorInitials(report.content.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{report.content.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(report.content.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
              
              {report.content.title && (
                <h4 className="font-semibold text-white mb-2">{report.content.title}</h4>
              )}
              
              <div className="prose prose-invert max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {report.content.content}
                </p>
              </div>
            </div>
          </div>

          {/* Ações de Moderação */}
          {report.status === "pending" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="moderator-notes">Notas do Moderador (opcional)</Label>
                <Textarea
                  id="moderator-notes"
                  placeholder="Adicione observações sobre sua decisão..."
                  value={moderatorNotes}
                  onChange={(e) => setModeratorNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="action-taken">Ação Tomada (opcional)</Label>
                <Textarea
                  id="action-taken"
                  placeholder="Descreva a ação tomada (ex: conteúdo removido, usuário advertido...)"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </div>
          )}

          {/* Histórico de Moderação */}
          {report.moderator && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Moderado por</h4>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{report.moderator.name}</span>
                <span className="text-xs text-muted-foreground">
                  em {new Date(report.updatedAt).toLocaleString("pt-BR")}
                </span>
              </div>
              {report.moderatorNotes && (
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Notas:</strong> {report.moderatorNotes}
                </p>
              )}
              {report.actionTaken && (
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Ação:</strong> {report.actionTaken}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          
          {report.status === "pending" && (
            <>
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate("rejected")}
                disabled={isProcessing}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
              <Button
                onClick={() => handleStatusUpdate("approved")}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
