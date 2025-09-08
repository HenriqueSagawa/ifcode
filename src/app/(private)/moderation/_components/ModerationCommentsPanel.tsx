"use client";

import { useEffect, useMemo, useState } from "react";
import { listCommentsForModeration, updateCommentStatus } from "@/actions/commentsModeration";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { addToast } from "@heroui/toast";

type CommentStatus = "accepted" | "rejected" | "pending";

export function ModerationCommentsPanel() {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<CommentStatus | "all">("pending");
  const [postFilter, setPostFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (postFilter.trim() && c.postId !== postFilter.trim()) return false;
      if (userFilter.trim() && c.userId !== userFilter.trim()) return false;
      return true;
    });
  }, [comments, statusFilter, postFilter, userFilter]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await listCommentsForModeration({});
      if (!res.success) throw new Error(res.message);
      setComments(res.comments || []);
    } catch (e: any) {
      addToast({ title: "Erro", description: e.message || "Falha ao carregar comentários", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const setStatus = async (commentId: string, status: CommentStatus) => {
    try {
      const res = await updateCommentStatus(commentId, status);
      if (!res.success) throw new Error(res.message);
      setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, status } : c)));
      addToast({ title: "Sucesso", description: "Comentário atualizado", color: "success" });
    } catch (e: any) {
      addToast({ title: "Erro", description: e.message || "Não foi possível atualizar", color: "danger" });
    }
  };

  return (
    <Card className="bg-muted/50 border-gray-700">
      <CardHeader>
        <CardTitle>Moderar Comentários</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="accepted">Aceitos</SelectItem>
              <SelectItem value="rejected">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Filtrar por postId" value={postFilter} onChange={(e) => setPostFilter(e.target.value)} className="w-60" />
          <Input placeholder="Filtrar por userId" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="w-60" />
          <Button variant="outline" onClick={loadComments} disabled={loading}>{loading ? "Carregando..." : "Atualizar"}</Button>
        </div>

        <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
          {filteredComments.length === 0 && <div className="text-sm text-muted-foreground">Nenhum comentário encontrado.</div>}
          {filteredComments.map((c) => (
            <div key={c.id} className="p-3 rounded-md border border-gray-700 bg-muted/30">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm">{c.content}</div>
                  <div className="text-xs text-muted-foreground">ID: {c.id} • Post: {c.postId} • Autor: {c.userId}</div>
                  <div className="text-xs mt-1">
                    <span className="px-2 py-0.5 rounded-full border border-gray-600 text-xs capitalize">{c.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {c.status !== "accepted" && (
                    <Button size="sm" variant="default" onClick={() => setStatus(c.id, "accepted")}>Aceitar</Button>
                  )}
                  {c.status !== "rejected" && (
                    <Button size="sm" variant="destructive" onClick={() => setStatus(c.id, "rejected")}>Rejeitar</Button>
                  )}
                  {c.status !== "pending" && (
                    <Button size="sm" variant="secondary" onClick={() => setStatus(c.id, "pending")}>Pendente</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


