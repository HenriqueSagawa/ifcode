"use client";

import { useEffect, useState } from "react";
import { getReports, updateReportStatus } from "@/actions/reports";
import { ReportWithDetails, ReportFilters, ReportStatus } from "@/types/reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Filter,
  Search,
  RefreshCw
} from "lucide-react";
import { addToast } from "@heroui/toast";
import { ReportDetailsModal } from "./ReportDetailsModal";

export function ModerationQueue() {
  const [reports, setReports] = useState<ReportWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportWithDetails | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    status: ["pending"]
  });
  const [searchTerm, setSearchTerm] = useState("");

  const loadReports = async () => {
    setLoading(true);
    try {
      const result = await getReports(filters, 20);
      setReports(result.reports);
    } catch (error) {
      console.error("Erro ao carregar denúncias:", error);
      addToast({
        title: "Erro",
        description: "Erro ao carregar denúncias",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [filters]);

  const handleStatusChange = async (reportId: string, status: ReportStatus, actionTaken?: string) => {
    try {
      const result = await updateReportStatus(reportId, status, undefined, actionTaken);
      
      if (result.success) {
        addToast({
          title: "Sucesso",
          description: result.message,
          color: "success",
        });
        loadReports(); // Recarregar a lista
        setSelectedReport(null);
      } else {
        addToast({
          title: "Erro",
          description: result.message,
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Erro",
        description: "Erro ao atualizar status da denúncia",
        color: "danger",
      });
    }
  };

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

  const filteredReports = reports.filter(report => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      report.content.title?.toLowerCase().includes(searchLower) ||
      report.content.content.toLowerCase().includes(searchLower) ||
      report.reporter.name.toLowerCase().includes(searchLower) ||
      report.content.authorName.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Card className="bg-muted/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            Fila de Moderação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-muted/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Fila de Moderação
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadReports}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por conteúdo, autor ou denunciante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.status?.[0] || "pending"}
              onValueChange={(value) => setFilters({ ...filters, status: [value as ReportStatus] })}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovadas</SelectItem>
                <SelectItem value="rejected">Rejeitadas</SelectItem>
                <SelectItem value="resolved">Resolvidas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Denúncias */}
          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma denúncia encontrada
                </p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border border-gray-700 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status === "pending" && "Pendente"}
                          {report.status === "approved" && "Aprovada"}
                          {report.status === "rejected" && "Rejeitada"}
                          {report.status === "resolved" && "Resolvida"}
                        </Badge>
                        <Badge variant="outline">
                          {report.contentType === "post" ? "Post" : "Comentário"}
                        </Badge>
                        <Badge variant="outline">
                          {getReasonLabel(report.reason)}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-white mb-1">
                        {report.content.title || "Sem título"}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {report.content.content}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>
                        Denunciado por: <strong>{report.reporter.name}</strong>
                      </span>
                      <span>
                        Autor: <strong>{report.content.authorName}</strong>
                      </span>
                    </div>
                    <span>
                      {new Date(report.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
