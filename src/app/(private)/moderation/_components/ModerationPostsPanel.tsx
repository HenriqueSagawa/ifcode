"use client";

import { useEffect, useMemo, useState } from "react";
import { listPostsForModeration, updatePostStatus, restorePost } from "@/actions/postsModeration";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { addToast } from "@heroui/toast";

type PostStatus = "published" | "archived" | "deleted";

export function ModerationPostsPanel() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");
  const [searchUserId, setSearchUserId] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (searchUserId.trim() && p.userId !== searchUserId.trim()) return false;
      return true;
    });
  }, [posts, statusFilter, searchUserId]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await listPostsForModeration({});
      if (!res.success) throw new Error(res.message);
      setPosts(res.posts || []);
    } catch (e: any) {
      addToast({ title: "Erro", description: e.message || "Falha ao carregar posts", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleStatusChange = async (postId: string, status: PostStatus) => {
    try {
      const res = await updatePostStatus(postId, status);
      if (!res.success) throw new Error(res.message);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status } : p)));
      addToast({ title: "Sucesso", description: "Status atualizado", color: "success" });
    } catch (e: any) {
      addToast({ title: "Erro", description: e.message || "Não foi possível atualizar", color: "danger" });
    }
  };

  const handleRestore = async (postId: string) => {
    try {
      const res = await restorePost(postId);
      if (!res.success) throw new Error(res.message);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status: "published" } : p)));
      addToast({ title: "Sucesso", description: "Post restaurado", color: "success" });
    } catch (e: any) {
      addToast({ title: "Erro", description: e.message || "Não foi possível restaurar", color: "danger" });
    }
  };

  return (
    <Card className="bg-muted/50 border-gray-700">
      <CardHeader>
        <CardTitle>Gerenciar Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
              <SelectItem value="deleted">Deletado</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Filtrar por userId" value={searchUserId} onChange={(e) => setSearchUserId(e.target.value)} className="w-64" />
          <Button variant="outline" onClick={loadPosts} disabled={loading}>{loading ? "Carregando..." : "Atualizar"}</Button>
        </div>

        <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
          {filteredPosts.length === 0 && (
            <div className="text-sm text-muted-foreground">Nenhum post encontrado.</div>
          )}
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-3 rounded-md border border-gray-700 bg-muted/30">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{post.title || "(Sem título)"}</div>
                  <div className="text-xs text-muted-foreground">ID: {post.id} • Autor: {post.userId || "?"}</div>
                  <div className="text-xs mt-1">
                    <span className="px-2 py-0.5 rounded-full border border-gray-600 text-xs capitalize">{post.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {post.status !== "published" && (
                    <Button size="sm" variant="default" onClick={() => handleRestore(post.id)}>Restaurar</Button>
                  )}
                  {post.status !== "archived" && (
                    <Button size="sm" variant="secondary" onClick={() => handleStatusChange(post.id, "archived")}>Arquivar</Button>
                  )}
                  {post.status !== "deleted" && (
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(post.id, "deleted")}>Deletar</Button>
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


